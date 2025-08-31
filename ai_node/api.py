# ai_node_complete.py
from dotenv import load_dotenv
load_dotenv()

import httpx
import time
from typing import Optional, Dict, TypeVar, Generic,  Any
from dataclasses import dataclass
import nacl.signing
import nacl.encoding
import logging
import os
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import tempfile
from contextlib import asynccontextmanager

# Import your existing components
from file_processor import FileProcessor
from langchain_huggingface import HuggingFaceEmbeddings
from db import SessionLocal
from models import get_chat_memory, update_chat_memory, ChatMemory
from rag_pipeline import RAGPipeline
from sqlalchemy.exc import SQLAlchemyError
from utils import utc_now
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SessionChatRequest(BaseModel):
    user_id: str
    session_id: str
    query: str

class IngestRequest(BaseModel):
    file_id : str
@dataclass
class AINodeCredentials:
    """Stores AI node authentication credentials"""
    public_key: bytes
    private_key: bytes
    username: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[float] = None


class AINodeAuthenticator:
    """Handles authentication for AI nodes with automatic token refresh"""
    
    def __init__(self, 
                 server_base_url: str, 
                 public_key: bytes, 
                 private_key: bytes,
                 username: str):
        self.server_base_url = server_base_url.rstrip('/')
        self.credentials = AINodeCredentials(
            public_key=public_key,
            private_key=private_key,
            username=username
        )
        self.client = httpx.AsyncClient(timeout=30.0)  # Add timeout
        self._setup_client()
    
    def _setup_client(self):
        """Configure the httpx client"""
        self.client.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Node-Client/1.0'
        })
    
    def _sign_message(self, message: str) -> str:
        """Sign a message with the AI node's private key"""
        try:
            signing_key = nacl.signing.SigningKey(self.credentials.private_key)
            signature = signing_key.sign(
                message.encode('utf-8'),
                encoder=nacl.encoding.HexEncoder
            )
            return signature.signature.decode('utf-8')
        except Exception as e:
            logger.error(f"Failed to sign message: {e}")
            raise
    
    def _is_token_expired(self) -> bool:
        """Check if the current access token is expired"""
        if not self.credentials.access_token or not self.credentials.token_expires_at:
            return True
        return time.time() >= (self.credentials.token_expires_at - 30)
    
    async def login(self) -> bool:
        """Perform initial login with the server"""
        try:
            login_request_url = f"{self.server_base_url}/api/auth/login/request"
            public_key_hex = self.credentials.public_key.hex()
            
            response = await self.client.post(login_request_url, json={
                'username': public_key_hex
            })
            
            if response.status_code != 200:
                logger.error(f"Failed to get login challenge: {response.status_code} - {response.text}")
                return False
            
            data = response.json()
            nonce = data['nonce']
            challenge_message = data['challenge_message']
            
            signature = self._sign_message(challenge_message)
            
            verify_url = f"{self.server_base_url}/api/auth/login/verify"
            verify_response = await self.client.post(verify_url, json={
                'username': public_key_hex,
                'nonce': nonce,
                'signature': signature
            })
            
            if verify_response.status_code != 200:
                logger.error(f"Login verification failed: {verify_response.status_code} - {verify_response.text}")
                return False
            
            token_data = verify_response.json()
            self.credentials.access_token = token_data['access_token']
            self.credentials.refresh_token = token_data['refresh_token']
            
            expires_in = token_data.get('expires_in', 3600)
            self.credentials.token_expires_at = time.time() + expires_in
            
            self._update_auth_header()
            logger.info("Successfully authenticated with server")
            return True
            
        except Exception as e:
            logger.error(f"Login failed: {e}")
            return False
    
    def _update_auth_header(self):
        """Update the Authorization header in the client"""
        if self.credentials.access_token:
            self.client.headers['Authorization'] = f'Bearer {self.credentials.access_token}'
        else:
            self.client.headers.pop('Authorization', None)
    
    async def refresh_token(self) -> bool:
        """Refresh the access token using the refresh token"""
        if not self.credentials.refresh_token:
            return False
        
        try:
            refresh_url = f"{self.server_base_url}/api/auth/token/refresh"
            response = await self.client.post(refresh_url, json={
                'refresh_token': self.credentials.refresh_token
            })
            
            if response.status_code != 200:
                logger.error(f"Token refresh failed: {response.status_code} - {response.text}")
                return False
            
            token_data = response.json()
            self.credentials.access_token = token_data['access_token']
            self.credentials.refresh_token = token_data.get('refresh_token', self.credentials.refresh_token)
            
            expires_in = token_data.get('expires_in', 3600)
            self.credentials.token_expires_at = time.time() + expires_in
            
            self._update_auth_header()
            logger.info("Successfully refreshed access token")
            return True
            
        except Exception as e:
            logger.error(f"Token refresh failed: {e}")
            return False
    
    async def ensure_valid_token(self) -> bool:
        """Ensure we have a valid access token"""
        if not self.credentials.access_token:
            return await self.login()
        
        if self._is_token_expired():
            success = await self.refresh_token()
            if not success:
                return await self.login()
            return success
        
        return True
    
    async def authenticated_request(self, method: str, endpoint: str, **kwargs) -> httpx.Response:
        """Make an authenticated request with automatic token refresh"""
        url = f"{self.server_base_url}{endpoint}"
        
        if not await self.ensure_valid_token():
            raise Exception("Failed to authenticate with server")
        
        try:
            response = await self.client.request(method, url, **kwargs)
            
            if response.status_code == 401:
                logger.info("Received 401, attempting token refresh")
                
                if await self.refresh_token():
                    response = await self.client.request(method, url, **kwargs)
                else:
                    if await self.login():
                        response = await self.client.request(method, url, **kwargs)
                    else:
                        raise Exception("Authentication failed after retry")
            
            return response
            
        except httpx.RequestError as e:
            logger.error(f"Request failed: {e}")
            raise
    
    async def post(self, endpoint: str, **kwargs) -> httpx.Response:
        """Authenticated POST request"""
        return await self.authenticated_request('POST', endpoint, **kwargs)
    
    async def get(self, endpoint: str, **kwargs) -> httpx.Response:
        """Authenticated GET request"""
        return await self.authenticated_request('GET', endpoint, **kwargs)
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


class AINodeService:
    """Service class for AI node operations"""
    
    def __init__(self, authenticator: AINodeAuthenticator):
        self.auth = authenticator


T = TypeVar('T', bound=BaseModel)

class SignedRequest(BaseModel, Generic[T]):
    """
    Wrapper for signed requests that contain:
    - public_key: hex encoded public key
    - signature: hex encoded signature  
    - data: the actual pydantic schema being signed
    """
    public_key: str = Field(..., regex=r'^[0-9a-fA-F]{64}$', description="64-character hex public key")
    signature: str = Field(..., regex=r'^[0-9a-fA-F]+$', description="Hex-encoded signature")
    data: T = Field(..., description="The signed data payload")

    @field_validator('public_key')
    @classmethod
    def validate_public_key_format(cls, v):
        try:
            bytes.fromhex(v)
            return v
        except ValueError:
            raise ValueError('Invalid hex format for public_key')

    @field_validator('signature')
    @classmethod
    def validate_signature_format(cls, v):
        try:
            bytes.fromhex(v)
            return v
        except ValueError:
            raise ValueError('Invalid hex format for signature')


async def verify_user_signature(signed_request: SignedRequest[T]) -> T:
    """
    Verify that the public_key in the signed request is the signing entity
    for the data payload.
    
    Args:
        signed_request: SignedRequest containing public_key, signature, and data
        
    Returns:
        The verified data payload (the original pydantic model)
        
    Raises:
        HTTPException: If signature verification fails
    """
    try:
        # Get the components
        public_key_hex = signed_request.public_key
        signature_hex = signed_request.signature
        data = signed_request.data
        
        # Convert hex to bytes
        public_key_bytes = bytes.fromhex(public_key_hex)
        signature_bytes = bytes.fromhex(signature_hex)
        
        # Create the message that was signed (JSON string of data, sorted for consistency)
        message_to_verify = json.dumps(
            data.dict(), 
            sort_keys=True, 
            separators=(',', ':')
        )
        
        # Verify the signature
        try:
            verify_key = nacl.signing.VerifyKey(public_key_bytes)
            
            # Verify the signature
            verify_key.verify(
                message_to_verify.encode('utf-8'),
                signature_bytes,
                encoder=nacl.encoding.HexEncoder
            )
            
            logger.info(f"Signature verification successful for public key: {public_key_hex[:16]}...")
            
            # Return the verified data
            return data
            
        except nacl.exceptions.BadSignatureError:
            logger.warning(f"Signature verification failed for public key: {public_key_hex[:16]}...")
            raise HTTPException(status_code=401, detail="Invalid signature")
        except Exception as e:
            logger.error(f"Signature verification error: {e}")
            raise HTTPException(status_code=400, detail=f"Signature verification failed: {str(e)}")
            
    except Exception as e:
        logger.error(f"Unexpected error in signature verification: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during verification")
    
# Global instances
auth_client: Optional[AINodeAuthenticator] = None
ai_service: Optional[AINodeService] = None


def initialize_ai_node_auth() -> AINodeAuthenticator:
    """Initialize the AI node with its credentials from environment"""
    public_key_hex = os.getenv('PUBLIC_KEY')
    private_key_hex = os.getenv('PRIVATE_KEY')
    server_url = os.getenv('SERVER_URL')
    
    if not all([public_key_hex, private_key_hex, server_url]):
        raise ValueError("Missing required environment variables: PUBLIC_KEY, PRIVATE_KEY, SERVER_URL")
    
    try:
        public_key = bytes.fromhex(public_key_hex)
        private_key = bytes.fromhex(private_key_hex)
    except ValueError as e:
        raise ValueError(f"Invalid hex format in keys: {e}")
    
    username = public_key_hex
    
    return AINodeAuthenticator(
        server_base_url=server_url,
        public_key=public_key,
        private_key=private_key,
        username=username
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup logic
    print("Application startup: Initializing resources...")
    global auth_client, ai_service
    
    try:
        auth_client = initialize_ai_node_auth()
        ai_service = AINodeService(auth_client)
        
        # Attempt initial login
        success = await auth_client.login()
        if success:
            logger.info("AI Node authenticated successfully on startup")
        else:
            logger.warning("Failed to authenticate on startup - will retry on first request")
            
    except Exception as e:
        logger.error(f"Startup authentication failed: {e}")
    
    yield
    
    # Shutdown logic
    print("Application shutdown: Cleaning up resources...")
    if auth_client:
        try:
            await auth_client.close()
        except Exception as e:
            logger.error(f"Error closing auth client: {e}")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="AI Node API", 
    description="APIs for contextual chat and queries over drive data.",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class ChatRequest(BaseModel):
    query: str
    k: Optional[int] = 3
    drive: Optional[str] = None
    folder: Optional[str] = None
    file: Optional[str] = None


# Dependency to ensure authentication
async def ensure_authenticated():
    """Dependency to ensure AI node is authenticated"""
    global auth_client
    
    if not auth_client:
        raise HTTPException(status_code=503, detail="AI node not initialized")
    
    if not await auth_client.ensure_valid_token():
        raise HTTPException(status_code=503, detail="AI node authentication failed")
    
    return auth_client


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": utc_now().isoformat()}


# --- Ingestion Endpoint ---
@app.post("/ingest")
async def ingest(
    signed_request: SignedRequest[IngestRequest],
    file: UploadFile = File(...),
    auth: AINodeAuthenticator = Depends(ensure_authenticated),
):
    """
    Ingest and AI-enable a file: chunk, embed, encrypt, and return encrypted data for storage.
    """
    request = await verify_user_signature(signed_request)
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="File must have a filename")
        
        file_id = request.file_id
        # Read file content
        file_bytes = await file.read()
        filename = file.filename

        # Process file using existing logic
        processor = FileProcessor()
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp_file:
            tmp_file.write(file_bytes)
            temp_path = tmp_file.name

        try:
            # Chunk and extract content
            processed_docs = processor.process(temp_path, original_filename=filename)
            if not processed_docs:
                raise HTTPException(status_code=400, detail="Unsupported or failed to process file type")

        finally:
            # Ensure temp file is cleaned up
            try:
                os.remove(temp_path)
            except OSError as e:
                logger.warning(f"Failed to remove temp file {temp_path}: {e}")

        # Generate embeddings
        embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        texts = [doc.page_content for doc in processed_docs]
        embeddings = embedder.embed_documents(texts)

        # Store in database
        chunks = []
        for doc, emb in zip(processed_docs, embeddings):
            clean_chunk = doc.page_content.replace('\x00', '')
            
            chunk_obj = {
                "chunk": clean_chunk, 
                "embedding": emb, 
                "file_id": file_id
            }
            chunk_obj.update(doc.metadata)
            chunks.append(chunk_obj)

        # TODO: encrypt and send to server to store.
        payload = chunks      

        return {
            "file": filename,
            "num_chunks": len(chunks),
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


# --- Session-based Chat Endpoint ---
@app.post("/chat/session")
async def chat_session(
    signed_request: SignedRequest[SessionChatRequest],
    auth: AINodeAuthenticator = Depends(ensure_authenticated)
):
    """Enhanced chat endpoint with semantic search and memory"""
    request = await verify_user_signature(signed_request)
    db_session = None
    try:
        db_session = SessionLocal()
        
        # Fetch chat memory
        chat_mem = await get_chat_memory(db_session, request.user_id, request.session_id)
        memory = chat_mem.memory if chat_mem else []
        
        # Initialize RAG pipeline
        rag = RAGPipeline(
            embedding_model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Run RAG with database integration
        rag_result = await rag.run_with_db(
            db_session=db_session,
            query=request.query,
            memory=memory,
            k=5
        )
        
        # Update conversation memory
        user_msg = {"role": "user", "content": request.query}
        ai_msg = {"role": "ai", "content": rag_result.get("answer", "")}
        updated_memory = memory + [user_msg, ai_msg]
        
        # Save memory
        if chat_mem:
            chat_mem.memory = updated_memory
            chat_mem.updated_at = utc_now()
        else:
            chat_mem = ChatMemory(
                user_id=request.user_id,
                session_id=request.session_id,
                memory=updated_memory,
                updated_at=utc_now()
            )
            db_session.add(chat_mem)
        
        await db_session.commit()
        
        return {
            "user_id": request.user_id,
            "session_id": request.session_id,
            "query": request.query,
            "answer": rag_result["answer"],
            "citations": rag_result["citations"],
            "context_chunks_used": rag_result["context_chunks_used"],
            "memory_length": len(updated_memory)
        }
        
    except Exception as e:
        logger.error(f"Chat session failed: {e}")
        if db_session:
            await db_session.rollback()
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
    finally:
        if db_session:
            await db_session.close()


@app.post("/auth/login")
async def manual_login():
    """Manual login endpoint for testing"""
    global auth_client
    
    try:
        if not auth_client:
            raise HTTPException(status_code=503, detail="Auth client not initialized")
        
        success = await auth_client.login()
        if success:
            return {
                "message": "Login successful",
                "authenticated": True,
                "timestamp": utc_now().isoformat()
            }
        else:
            raise HTTPException(status_code=401, detail="Login failed")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Manual login failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "ai_node_complete:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        reload=os.getenv("ENVIRONMENT") == "development"
    )