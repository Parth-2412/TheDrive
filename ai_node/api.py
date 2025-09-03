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
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import tempfile
from contextlib import asynccontextmanager
from typing import TypedDict, List
# Import your existing components
from file_processor import FileProcessor
from langchain_huggingface import HuggingFaceEmbeddings
from db import SessionLocal, engine, Base
from models import ChatMessageDB, ChatSessionDB
from rag_pipeline import RAGPipeline
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from utils import utc_now
import json
from crypto_utils import encrypt_input_bytes, decrypt_input_bytes, encrypt_input, decrypt_input
import numpy as np
import chromadb
from chromadb.config import Settings
import uuid
import shutil
import datetime
import base64
from collections import defaultdict
from pydantic.generics import GenericModel


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FileType(TypedDict):
    id: str
    name: str

class StartChatRequest(BaseModel):
    files: List[FileType]
    folder_id : str
class IngestRequest(BaseModel):
    file_id : str




class CloseSessionRequest(BaseModel):
    session_id: str

class ChatMessage(BaseModel):
    session_id: str
    query: str




class FileIngestResponse(BaseModel):
    file_id: str = Field(..., description="File id")
    filename: str = Field(..., description="File name")
    num_chunks: int = Field(..., ge=0, description="Number of chunks created from the file")

    model_config = {
        "json_schema_extra": {
            "examples": [{"filename": "notes.pdf", "file_id": "37848489w0", "num_chunks": 37}]
        }
    }


class SessionLoadResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    chunks_loaded: int = Field(..., ge=0, description="Number of chunks loaded into the session")

    model_config = {
        "json_schema_extra": {
            "examples": [{"session_id": "sess_123", "chunks_loaded": 120}]
        }
    }


class SessionIdResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")

    model_config = {
        "json_schema_extra": {
            "examples": [{"session_id": "sess_123"}]
        }
    }


class Citation(BaseModel):
    source_id: int = Field(..., ge=0, description="1-based (or 0-based) index for the source")
    file_name: str = Field(..., description="Original file name")
    file_id: str = Field(..., description="Internal file ID")
    chunk_index: int = Field(..., ge=0, description="Index of the chunk within the file")
    char_start: int = Field(..., ge=0, description="Character start offset of the cited span")
    char_end: int = Field(..., ge=0, description="Character end offset of the cited span")
    similarity: float = Field(..., ge=0.0, description="Similarity score (e.g., cosine)")
    chunk_content: str = Field(..., description="Raw text content of the cited chunk")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "source_id": 1,
                    "file_name": "notes.pdf",
                    "file_id": "file_abc",
                    "chunk_index": 12,
                    "char_start": 0,
                    "char_end": 180,
                    "similarity": 0.873,
                    "chunk_content": "The quick brown fox jumps over the lazy dog ..."
                }
            ]
        }
    }


class QueryAnswerResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    query: str = Field(..., description="Original user query")
    answer: str = Field(..., description="RAG answer text")
    citations: List[Citation] = Field(
        default_factory=list,
        description="List of citations that support the answer"
    )
    context_chunks_used: int = Field(..., ge=0, description="Number of chunks used to produce the answer")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "session_id": "sess_123",
                    "query": "What are the key takeaways?",
                    "answer": "The report highlights three key takeaways: ...",
                    "citations": [
                        {
                            "source_id": 1,
                            "file_name": "notes.pdf",
                            "file_id": "file_abc",
                            "chunk_index": 12,
                            "char_start": 0,
                            "char_end": 180,
                            "similarity": 0.873,
                            "chunk_content": "The quick brown fox jumps over the lazy dog ..."
                        }
                    ],
                    "context_chunks_used": 4
                }
            ]
        }
    }


@dataclass
class AINodeCredentials:
    """Stores AI node authentication credentials"""
    public_key: bytes
    private_key: bytes
    username: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_expires_at: Optional[float] = None


class ServerService:
    """Handles authentication for AI nodes with automatic token refresh"""
    
    def __init__(self, 
                 server_base_url: str, 
                 public_key: bytes, 
                 private_key: bytes,
                 master_key: bytes,
                 username: str):
        self.server_base_url = server_base_url.rstrip('/')
        self.credentials = AINodeCredentials(
            public_key=public_key,
            private_key=private_key,
            username=username
        )
        self.master_key = master_key
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


T = TypeVar('T', bound=BaseModel)

class SignedRequest(GenericModel, Generic[T]):
    """
    Wrapper for signed requests that contain:
    - public_key: hex encoded public key
    - signature: hex encoded signature  
    - data: the actual pydantic schema being signed
    """
    public_key: str = Field(..., pattern=r'^[0-9a-fA-F]{64}$', description="64-character hex public key")
    signature: str = Field(..., pattern=r'^[0-9a-fA-F]+$', description="Hex-encoded signature")
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
            if len(v) % 2 != 0:
                raise ValueError()
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
    # Get the components
    public_key_hex = signed_request.public_key
    signature_hex = signed_request.signature
    data = signed_request.data
    
    # Convert hex to bytes
    public_key_bytes = bytes.fromhex(public_key_hex)
    signature_bytes = bytes.fromhex(signature_hex)
    
    # Create the message that was signed (JSON string of data, sorted for consistency)
    message_to_verify = data.model_dump_json()

    # Verify the signature
    try:
        verify_key = nacl.signing.VerifyKey(public_key_bytes)
        print(message_to_verify)
        verify_key.verify(
            message_to_verify.encode('utf-8'),
            signature_bytes,
        )
        response = await service.get(f'/api/is_user?public_key={public_key_hex}')
        if response.json()["response"] != "yes":
                raise HTTPException(status_code=404, detail="User not found")
        logger.info(f"Signature verification successful for public key: {public_key_hex[:16]}...")
        
        # Return the verified data
        return data
        
    except nacl.exceptions.BadSignatureError:
        logger.warning(f"Signature verification failed for public key: {public_key_hex[:16]}...")
        raise HTTPException(status_code=401, detail="Invalid signature")
    except Exception as e:
        logger.error(f"Signature verification error: {e}")
        raise HTTPException(status_code=400, detail=f"Signature verification failed: {str(e)}")
            
    
    
# Global instances
service: Optional[ServerService] = None


def initialize_ai_node_auth() -> ServerService:
    """Initialize the AI node with its credentials from environment"""
    public_key_hex = os.getenv('PUBLIC_KEY')
    private_key_hex = os.getenv('PRIVATE_KEY')
    server_url = os.getenv('SERVER_URL')
    master_key_hex = os.getenv('MASTER_KEY')
    
    if not all([public_key_hex, private_key_hex, server_url]):
        raise ValueError("Missing required environment variables: PUBLIC_KEY, PRIVATE_KEY, SERVER_URL")
    
    try:
        public_key = bytes.fromhex(public_key_hex)
        private_key = bytes.fromhex(private_key_hex)
        master_key = bytes.fromhex(master_key_hex)
    except ValueError as e:
        raise ValueError(f"Invalid hex format in keys: {e}")
    
    username = public_key_hex
    
    return ServerService(
        server_base_url=server_url,
        public_key=public_key,
        private_key=private_key,
        master_key=master_key,
        username=username
    )

processor = None
rag = None
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup logic
    print("Application startup: Initializing resources...")
    global service
    
    try:
        service = initialize_ai_node_auth()
        global processor
        processor = FileProcessor()
        global rag
        rag = RAGPipeline(
            embedding_model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        # Attempt initial login
        success = await service.login()
        if success:
            logger.info("AI Node authenticated successfully on startup")
        else:
            logger.warning("Failed to authenticate on startup - will retry on first request")
            
    except Exception as e:
        logger.error(f"Startup authentication failed: {e}")
    
    yield
    
    # Shutdown logic
    print("Application shutdown: Cleaning up resources...")
    if service:
        try:
            await service.close()
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
    folder: Optional[str] = None
    files: Optional[str] = None


# Dependency to ensure authentication
async def ensure_authenticated():
    """Dependency to ensure AI node is authenticated"""
    global service
    
    if not service:
        raise HTTPException(status_code=503, detail="AI node not initialized")
    
    if not await service.ensure_valid_token():
        raise HTTPException(status_code=503, detail="AI node authentication failed")
    
    return service


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": utc_now().isoformat()}


# --- Ingestion Endpoint ---
@app.post(
    "/ingest",
    response_model=FileIngestResponse
)
async def ingest(
    signed_request: str = Form(...),
    file: UploadFile = File(...),
    auth: ServerService = Depends(ensure_authenticated),
):
    """
    Ingest and AI-enable a file: chunk, embed, encrypt, and return encrypted data for storage.
    """
    request = None
    try:
        # Manually parse the JSON string into a Python dictionary
        signed_request = json.loads(signed_request)
        # Validate the parsed data using Pydantic model
        signed_request = SignedRequest[IngestRequest](**signed_request)
        request = await verify_user_signature(signed_request)

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid request ")
    except Exception as e:
        raise e
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a filename")
    
    file_id = request.file_id
    # Read file content
    file_bytes = await file.read()
    filename = file.filename

    # Process file using existing logic
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
            "chunk_content_encrypted": encrypt_input(clean_chunk, master_aes_key=service.master_key), 
            "embedding_encrypted": encrypt_input_bytes(np.array(emb, dtype=np.float32).tobytes(), master_aes_key=service.master_key), 
        }
        chunk_obj.update(doc.metadata)
        chunks.append(chunk_obj)



    payload = {"chunks": chunks, "file_id" : file_id, "public_key" : signed_request.public_key }

    res = None
    try:
        res = await service.post('/api/chunks/store/', json=payload )
        res.raise_for_status()
    except httpx.HTTPStatusError as exc:
        print(f"Error status code: {exc.response.status_code}")
        raise exc
    except httpx.RequestError as exc:
        print(f"An error occurred during the request: {exc}")
        raise exc
    return {
        "filename": filename,
        "file_id": file_id,
        "num_chunks": len(chunks),
    }
        
    

    
    


@app.post("/chat/start",response_model=SessionLoadResponse)
async def chat_start(
    signed_request: SignedRequest[StartChatRequest],
    auth: ServerService = Depends(ensure_authenticated)
):
    """Start a new chat session with folder/file data"""
    request = await verify_user_signature(signed_request)
    db_session = None
    id_to_name = defaultdict(str)
    for file in request.files:
        id_to_name[file["id"]] = file["name"]
    try:
        db_session = SessionLocal()
        
        
        
        # Fetch chunks from server endpoints
        all_chunks = []
        
        
        # Get file chunks
        if request.files:
            files_response = await service.get('/api/chunks/files/', 
                                              json={"files": [file["id"] for file in request.files], "public_key": signed_request.public_key})
            if files_response.status_code == 200:
                files_data = files_response.json()
                all_chunks.extend([ {**chunk, "file_name" : id_to_name[chunk["file"]] } for chunk in files_data])
        if request.folder_id:
            folder_response = await service.get('/api/chunks/folder/', 
                                              json={"folder_id": request.folder_id, "public_key": signed_request.public_key})
            if folder_response.status_code == 200:
                folder_data = folder_response.json()
                all_chunks.extend(folder_data)
            else:
                print(folder_response.json())
        print(set([chunk["file"] for chunk in all_chunks]))
        
        if not all_chunks:
            raise HTTPException(status_code=404, detail="No file in this folder is ai-enable")
        
        # Decrypt and store chunks in ChromaDB
        documents = []
        metadatas = []
        ids = []
        embeddings = []
        
        for i, chunk_data in enumerate(all_chunks):
            # Decrypt chunk content and embedding
            decrypted_content = decrypt_input(chunk_data["chunk_content_encrypted"], service.master_key)
            decrypted_embedding = decrypt_input_bytes(chunk_data["embedding_encrypted"], service.master_key)
            
            # Prepare for ChromaDB
            chunk_id = chunk_data.get('id', f"chunk_{i}")
            documents.append(decrypted_content)
            metadatas.append({
                "file_name": chunk_data.get('file_name', 'Unknown'),
                "file_id": chunk_data.get('file', 'Unknown'),
                "chunk_index": chunk_data.get("order_in_file", i),
                "char_start": chunk_data.get("chunk_start", 0),
                "char_end": chunk_data.get("chunk_end", 0)
            })
            ids.append(chunk_id)
            embeddings.append(np.frombuffer(decrypted_embedding, dtype=np.float32))

        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Create vector database directory
        vector_db_dir = f"./vector_dbs"
        os.makedirs(vector_db_dir, exist_ok=True)
        vector_db_path = os.path.join(vector_db_dir, f"{session_id}.db")
        
        
        
        
        # Save session to database
        chat_session = ChatSessionDB(
            session_id=session_id,
            public_key=signed_request.public_key,
            vector_db_path=vector_db_path,
            created_at=utc_now(),
        )
        db_session.add(chat_session)
        await db_session.commit()
        # Initialize ChromaDB
        client = chromadb.PersistentClient(path=vector_db_path)
        collection = client.get_or_create_collection("documents")
        # Add to ChromaDB collection
        collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids,
            embeddings=embeddings
        )
        return {
            "session_id": session_id,
            "chunks_loaded": len(all_chunks),
        }
        
    except Exception as e:
        logger.error(f"Chat start failed: {e}")
        if db_session:
            await db_session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to start chat session: {str(e)}")
    finally:
        if db_session:
            await db_session.close()

# Add these models


# Modify the chat endpoint
@app.post("/chat", response_model=QueryAnswerResponse)
async def chat(
    signed_request: SignedRequest[ChatMessage],
    auth: ServerService = Depends(ensure_authenticated)
):
    """Chat with the loaded session data"""

    request = await verify_user_signature(signed_request)
    db_session = None
    
    try:
        db_session = SessionLocal()
        
        # Get session from database
        session_result = await db_session.execute(
            text("SELECT * FROM chat_sessions WHERE session_id = :session_id AND public_key = :public_key"),
            {"session_id": request.session_id, "public_key": signed_request.public_key}
        )
        session_row = session_result.mappings().first()
        
        if not session_row:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        # Get chat history for this session
        messages_result = await db_session.execute(
            text("SELECT role, content FROM chat_messages WHERE session_id = :session_id ORDER BY created_at"),
            {"session_id": request.session_id}
        )
        messages = messages_result.mappings().all()
        memory = [{"role": msg["role"], "content": msg["content"]} for msg in messages]
        
        # Store user message
        user_message_id = str(uuid.uuid4())
        user_message = ChatMessageDB(
            id=user_message_id,
            session_id=request.session_id,
            public_key=signed_request.public_key,
            role="user",
            content=request.query,
            created_at=utc_now()
        )
        db_session.add(user_message)
        
        
        # Run RAG with ChromaDB
        rag_result = await rag.run_with_chromadb(
            vector_db_path=session_row["vector_db_path"],
            query=request.query,
            memory=memory,
            k=5
        )
        
        # Store assistant response
        assistant_message_id = str(uuid.uuid4())
        assistant_message = ChatMessageDB(
            id=assistant_message_id,
            session_id=request.session_id,
            public_key=signed_request.public_key,
            role="assistant",
            content=rag_result["answer"],
            created_at=utc_now()
        )
        db_session.add(assistant_message)
        
       
        await db_session.commit()
        
        return {
            "session_id": request.session_id,
            "query": request.query,
            "answer": rag_result["answer"],
            "citations": rag_result["citations"],
            "context_chunks_used": rag_result["context_chunks_used"]
        }
        
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        if db_session:
            await db_session.rollback()
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
    finally:
        if db_session:
            await db_session.close()

# Also update close_session to clean up messages
@app.post("/chat/close", response_model=SessionIdResponse)
async def close_session(
    signed_request: SignedRequest[CloseSessionRequest],
    auth: ServerService = Depends(ensure_authenticated)
):
    """Close a chat session and cleanup resources"""
    request = await verify_user_signature(signed_request)
    db_session = None
    
    try:
        db_session = SessionLocal()
        
        # Get session from database
        session_result = await db_session.execute(
            text("SELECT * FROM chat_sessions WHERE session_id = :session_id AND public_key = :public_key"),
            {"session_id": request.session_id, "public_key": signed_request.public_key}
        )
        session_row = session_result.mappings().first()
        
        if not session_row:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        # Delete chat messages
        await db_session.execute(
            text("DELETE FROM chat_messages WHERE session_id = :session_id"),
            {"session_id": request.session_id}
        )
        
        # Delete vector database directory
        vector_db_path = session_row["vector_db_path"]
        if os.path.exists(vector_db_path):
            shutil.rmtree(vector_db_path, ignore_errors=True)
        
        # Delete session from database
        await db_session.execute(
            text("DELETE FROM chat_sessions WHERE session_id = :session_id"),
            {"session_id": request.session_id}
        )
        await db_session.commit()
        
        return {
            "session_id": request.session_id,
            "status": "closed"
        }
        
    except Exception as e:
        logger.error(f"Close session failed: {e}")
        if db_session:
            await db_session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to close session: {str(e)}")
    finally:
        if db_session:
            await db_session.close()




@app.post("/auth/login")
async def manual_login():
    """Manual login endpoint for testing"""
    global service
    
    try:
        if not service:
            raise HTTPException(status_code=503, detail="Auth client not initialized")
        
        success = await service.login()
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
        "api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        reload=os.getenv("ENVIRONMENT") == "development",
        reload_excludes=["model_cache/*", "vector_dbs/*"],  # Exclude directories from reload
        reload_includes=["*.py"],  # Only reload for Python file changes
    )