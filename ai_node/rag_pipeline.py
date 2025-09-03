"""
Retrieval-Augmented Generation (RAG) pipeline with ChromaDB integration.
Works with local ChromaDB instances for fast vector similarity search.
"""

from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_huggingface import HuggingFaceEmbeddings
import chromadb
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)

class RAGPipeline:
    _instance = None
    _is_initialized = False

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(RAGPipeline, cls).__new__(cls)
        return cls._instance

    def __init__(self, embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2", 
                 gemini_model: str = "models/gemini-2.5-flash"):
        """
        Initialize RAG pipeline with cached models.
        """
        # Skip initialization if already done
        if self._is_initialized:
            return

        try:
            # Cache the embedding model
            self.embedding_model = self._get_embedding_model(embedding_model_name)
            
            # Set up Gemini with caching
            self.gemini = self._setup_gemini(gemini_model)
            
            self._is_initialized = True
            logger.info("RAGPipeline initialized successfully with cached models")
            
        except Exception as e:
            logger.error(f"Error initializing RAGPipeline: {e}")
            raise

    @lru_cache(maxsize=1)
    def _get_embedding_model(self, model_name: str):
        """Cache and return the embedding model"""
        logger.info(f"Loading embedding model: {model_name}")
        return HuggingFaceEmbeddings(model_name=model_name)

    @lru_cache(maxsize=1)
    def _setup_gemini(self, model_name: str):
        """Cache and return the Gemini model"""
        logger.info(f"Setting up Gemini model: {model_name}")
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)
        return genai.GenerativeModel(model_name)

    @lru_cache(maxsize=100)
    def _embed_query(self, query: str) -> List[float]:
        """Cache query embeddings for repeated queries"""
        return self.embedding_model.embed_query(query)

    async def retrieve_context_from_chromadb(self, vector_db_path: str, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant chunks from ChromaDB based on semantic similarity.
        ChromaDB handles the similarity calculation internally.
        """
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.embed_query(query)

            # Connect to ChromaDB
            client = chromadb.PersistentClient(path=vector_db_path)
            collection = client.get_collection("documents")

            # Query ChromaDB for similar chunks (ChromaDB handles similarity internally)
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
                include=["documents", "metadatas", "distances"]
            )

            if not results["documents"][0]:
                return []

            # Format results - ChromaDB already did the similarity calculation
            chunks_with_similarity = []
            for i, (doc, metadata, distance) in enumerate(zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0]
            )):
                # Convert ChromaDB's distance to similarity score for consistency
                similarity = 1 / (1 + distance)  # Simple distance-to-similarity conversion

                chunks_with_similarity.append({
                    "content": doc,
                    "metadata": metadata,
                    "similarity": similarity
                })

            return chunks_with_similarity

        except Exception as e:
            logger.error(f"Error retrieving context from ChromaDB: {e}")
            return []

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]], 
                       memory: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """
        Generate answer with enhanced source attribution.
        """
        if not context_chunks:
            return {
                "answer": "I couldn't find any relevant information to answer your question.",
                "citations": [],
                "context_chunks_used": 0
            }
        
        # Build context with numbered sources for precise attribution
        context_parts = []
        for i, chunk in enumerate(context_chunks):
            meta = chunk['metadata']
            file_name = meta.get('file') or os.path.basename(meta.get('source', 'Unknown'))
            chunk_idx = meta.get('chunk_index', i)
            page = meta.get('page_number')
            
            source_label = f"[Source {i+1}: {file_name}"
            if page:
                source_label += f", Page {page}"
            source_label += f", Chunk {chunk_idx}]"
            context_parts.append(f"{source_label}\n{chunk['content']}\n")
        
        context_text = "\n".join(context_parts)
        
        # Build memory context
        memory_text = ""
        if memory:
            memory_text = "\n\nConversation History:\n" + "\n".join([
                f"{msg['role'].upper()}: {msg['content']}" for msg in memory[-6:]  # Last 3 exchanges
            ])
        
        # Enhanced prompt for source attribution
        prompt = f"""You are a helpful AI assistant. Answer the user's question using the provided context.

IMPORTANT: When referencing information, cite the specific source using the format [Source X] where X matches the source number provided in the context.

Context from Documents:
{context_text}
{memory_text}

Current Question: {query}

Instructions:
- Use the provided context to answer the question accurately
- Always cite sources using [Source X] format when referencing information
- If information comes from multiple sources, cite all relevant sources like [Source 1][Source 2]
- Be specific about which source supports each claim
- If the context doesn't contain enough information, say so clearly
- Maintain consistency with the conversation history
- Be concise but comprehensive

Answer:"""

        try:
            # Generate response
            response = self.gemini.generate_content(prompt)
            answer = response.text.strip() if hasattr(response, 'text') else str(response)
        except Exception as e:
            logger.error(f"Error generating answer with Gemini: {e}")
            answer = "I apologize, but I encountered an error while generating the response. Please try again."
        
        # Prepare enhanced citations
        citations = []
        for i, chunk in enumerate(context_chunks):
            meta = chunk['metadata']
            file_name = meta.get('file') or os.path.basename(meta.get('source', 'Unknown'))
            citations.append({
                "source_id": i + 1,
                "file_name": file_name,
                "file_id": meta.get('file_id', 'Unknown'),
                "page_number": meta.get('page_number'),
                "chunk_index": meta.get('chunk_index', i),
                "char_start": meta.get('char_start', 0),
                "char_end": meta.get('char_end', 0),
                "similarity": round(chunk.get("similarity", 0), 3),
                "chunk_content": chunk['content']
            })
        
        return {
            "answer": answer,
            "citations": citations,
            "context_chunks_used": len(context_chunks)
        }

    async def run_with_chromadb(self, vector_db_path: str, query: str, 
                               memory: Optional[List[Dict]] = None, k: int = 5) -> Dict[str, Any]:
        """
        Full RAG pipeline using ChromaDB:
        1. Retrieve relevant chunks from ChromaDB
        2. Generate answer with context and memory
        3. Return response with detailed citations
        """
        # Check if vector database exists
        if not os.path.exists(vector_db_path):
            return {
                "answer": "The chat session vector database could not be found. Please start a new session.",
                "citations": [],
                "context_chunks_used": 0
            }
        
        # Retrieve context from ChromaDB
        context_chunks = await self.retrieve_context_from_chromadb(vector_db_path, query, k)
        
        if not context_chunks:
            return {
                "answer": "I couldn't find any relevant information in the loaded documents to answer your question.",
                "citations": [],
                "context_chunks_used": 0
            }
        
        # Generate answer with citations
        return self.generate_answer(query, context_chunks, memory)

    async def get_all_chunks_info(self, vector_db_path: str) -> List[Dict[str, Any]]:
        """
        Get information about all chunks in the ChromaDB collection.
        Useful for debugging and session management.
        """
        try:
            client = chromadb.PersistentClient(path=vector_db_path)
            collection = client.get_collection("documents")
            
            # Get all documents
            results = collection.get(
                include=["documents", "metadatas"]
            )
            
            chunks_info = []
            for i, (doc, metadata) in enumerate(zip(results["documents"], results["metadatas"])):
                chunks_info.append({
                    "chunk_index": i,
                    "file_name": metadata.get('file_name', 'Unknown'),
                    "file_id": metadata.get('file_id', 'Unknown'),
                    "char_start": metadata.get('char_start', 0),
                    "char_end": metadata.get('char_end', 0),
                    "content_preview": doc[:100] + "..." if len(doc) > 100 else doc,
                    "content_length": len(doc)
                })
            
            return chunks_info
            
        except Exception as e:
            logger.error(f"Error getting chunks info: {e}")
            return []