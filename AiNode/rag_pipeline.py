# rag_pipeline.py
"""
Retrieval-Augmented Generation (RAG) pipeline for NeonDB integration.
Works with PostgreSQL database instead of local vector store.
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
        Initialize RAG pipeline for NeonDB integration.
        No local vector store - everything comes from database.
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
        """
        # Generate query embedding
        query_embedding = self.embedding_model.embed_query(query)
        
        # Fetch all chunks for the scope
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
            chunk_embedding = row["embedding"]  # Assuming this is already a list/array
            similarity = self.cosine_similarity(query_embedding, chunk_embedding)
            chunks_with_similarity.append({
                "content": row["chunk"],
                "metadata": row["meta"],
                "similarity": similarity
            })
        
        # Sort by similarity and return top-k
        chunks_with_similarity.sort(key=lambda x: x["similarity"], reverse=True)
        return chunks_with_similarity[:k]

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]], 
                       memory: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate answer using Gemini with context and chat history.
        """
        # Build context from chunks
        context_text = "\n\n".join([
            f"[Source: {chunk['metadata'].get('file', 'Unknown')}]\n{chunk['content']}"
            for chunk in context_chunks
        ])
        
        # Build memory context
        memory_text = ""
        if memory:
            memory_text = "\n\nConversation History:\n" + "\n".join([
                f"{msg['role'].upper()}: {msg['content']}" for msg in memory[-6:]  # Last 3 exchanges
            ])
        
        # Create prompt
        prompt = f"""You are a helpful AI assistant. Answer the user's question using the provided context and conversation history.

Context from Documents:
{context_text}
{memory_text}

Current Question: {query}

Instructions:
- Use the provided context to answer the question accurately
- Reference specific sources when possible
- If the context doesn't contain enough information, say so
- Maintain consistency with the conversation history
- Be concise but comprehensive

Answer:"""

        # Generate response
        response = self.gemini.generate_content(prompt)
        answer = response.text.strip() if hasattr(response, 'text') else str(response)
        
        # Prepare citations
        citations = [
            {
                "file": chunk["metadata"].get("file", "Unknown"),
                "scope": chunk["metadata"].get("scope", "Unknown"),
                "similarity": round(chunk.get("similarity", 0), 3)
            }
            for chunk in context_chunks
        ]
        
        return {
            "answer": answer,
            "citations": citations,
            "context_chunks_used": len(context_chunks)
        }

    async def run_with_db(self, db_session: AsyncSession, query: str, scope: str, 
                         memory: List[Dict] = None, k: int = 5) -> Dict[str, Any]:
        """
        Full RAG pipeline using NeonDB:
        1. Retrieve relevant chunks from database
        2. Generate answer with context and memory
        3. Return response with citations
        """
        # Retrieve context from database
        context_chunks = await self.retrieve_context_from_db(db_session, query, scope, k)
        
        if not context_chunks:
            return {
                "answer": f"I couldn't find any relevant information for scope '{scope}'. Please check if documents are available for this scope.",
                "citations": [],
                "context_chunks_used": 0
            }
        
        # Generate answer
        return self.generate_answer(query, context_chunks, memory)
