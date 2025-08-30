# rag_pipeline.py
"""
Retrieval-Augmented Generation (RAG) pipeline for NeonDB integration.
Works with PostgreSQL database and enhanced cross-referencing metadata.
"""

from typing import List, Dict, Any
import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_huggingface import HuggingFaceEmbeddings

class RAGPipeline:
    def __init__(self, embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2", 
                 gemini_model: str = "models/gemini-2.5-flash-lite"):
        """
        Initialize RAG pipeline for NeonDB integration with cross-referencing support.
        """
        self.embedding_model = HuggingFaceEmbeddings(model_name=embedding_model_name)
        
        # Set up Gemini
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)
        self.gemini = genai.GenerativeModel(gemini_model)

    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        a = np.array(a)
        b = np.array(b)
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    async def retrieve_context_from_db(self, db_session: AsyncSession, query: str, 
                                     scope: str, k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant chunks from NeonDB based on semantic similarity.
        Enhanced to work with cross-referencing metadata.
        """
        # Generate query embedding
        query_embedding = self.embedding_model.embed_query(query)
        
        # Fetch all chunks for the scope with enhanced metadata access
        result = await db_session.execute(
            text("SELECT chunk, embedding, meta FROM ai_chunks WHERE LOWER(meta->>'scope') = LOWER(:scope)"),
            {"scope": scope}
        )
        rows = result.mappings().all()
        
        if not rows:
            return []
        
        # Calculate similarities and rank
        chunks_with_similarity = []
        for row in rows:
            chunk_embedding = row["embedding"]
            similarity = self.cosine_similarity(query_embedding, chunk_embedding)
            
            # Extract enhanced metadata for cross-referencing
            meta = row["meta"]
            chunks_with_similarity.append({
                "content": row["chunk"],
                "metadata": meta,
                "similarity": similarity
            })
        
        # Sort by similarity and return top-k
        chunks_with_similarity.sort(key=lambda x: x["similarity"], reverse=True)
        return chunks_with_similarity[:k]

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]], 
                       memory: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate answer with enhanced source attribution for cross-referencing.
        """
        # Build context with numbered sources for precise attribution
        context_parts = []
        for i, chunk in enumerate(context_chunks):
            meta = chunk['metadata']
            file_name = meta.get('file', 'Unknown')
            page_num = meta.get('page_number', 1)
            chunk_idx = meta.get('chunk_index', i)
            
            source_label = f"[Source {i+1}: {file_name} - Page {page_num}, Chunk {chunk_idx}]"
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

        # Generate response
        response = self.gemini.generate_content(prompt)
        answer = response.text.strip() if hasattr(response, 'text') else str(response)
        
        # Prepare enhanced citations for cross-referencing
        citations = []
        for i, chunk in enumerate(context_chunks):
            meta = chunk['metadata']
            citations.append({
                "source_id": i + 1,
                "file": meta.get('file', 'Unknown'),
                "file_path": meta.get('file_path', ''),
                "page_number": meta.get('page_number', 1),
                "chunk_id": meta.get('chunk_id', ''),
                "chunk_index": meta.get('chunk_index', i),
                "char_start": meta.get('char_start', 0),
                "char_end": meta.get('char_end', 0),
                "scope": meta.get('scope', ''),
                "user_id": meta.get('user_id', ''),
                "similarity": round(chunk.get("similarity", 0), 3)
            })
        
        return {
            "answer": answer,
            "citations": citations,
            "context_chunks_used": len(context_chunks)
        }

    async def run_with_db(self, db_session: AsyncSession, query: str, scope: str, 
                         memory: List[Dict] = None, k: int = 5) -> Dict[str, Any]:
        """
        Full RAG pipeline using NeonDB with cross-referencing support:
        1. Retrieve relevant chunks from database
        2. Generate answer with enhanced context and memory
        3. Return response with detailed citations for cross-referencing
        """
        # Retrieve context from database
        context_chunks = await self.retrieve_context_from_db(db_session, query, scope, k)
        
        if not context_chunks:
            return {
                "answer": f"I couldn't find any relevant information for scope '{scope}'. Please check if documents are available for this scope.",
                "citations": [],
                "context_chunks_used": 0
            }
        
        # Generate answer with enhanced citations
        return self.generate_answer(query, context_chunks, memory)

    async def get_chunk_by_id(self, db_session: AsyncSession, chunk_id: str) -> Dict[str, Any]:
        """
        Retrieve specific chunk by chunk_id for highlighting functionality.
        """
        result = await db_session.execute(
            text("SELECT chunk, meta FROM ai_chunks WHERE meta->>'chunk_id' = :chunk_id"),
            {"chunk_id": chunk_id}
        )
        row = result.mappings().first()
        
        if not row:
            return None
        
        meta = row["meta"]
        return {
            "content": row["chunk"],
            "file": meta.get('file', 'Unknown'),
            "file_path": meta.get('file_path', ''),
            "page_number": meta.get('page_number', 1),
            "char_start": meta.get('char_start', 0),
            "char_end": meta.get('char_end', 0),
            "chunk_index": meta.get('chunk_index', 0)
        }
