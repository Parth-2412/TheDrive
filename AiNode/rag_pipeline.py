# rag_pipeline.py
"""
Retrieval-Augmented Generation (RAG) pipeline for the AI Node.
Modular design: can be imported and used in orchestration scripts or APIs.
"""
\
from typing import List, Dict, Any
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

import os
from dotenv import load_dotenv
import google.generativeai as genai

class RAGPipeline:

    def run_with_chunks(self, query: str, chunks: list) -> dict:
        """
        Run the RAG pipeline using externally provided chunks (e.g., from DB by scope).
        Each chunk should be a dict with 'chunk' (text) and 'meta' (metadata).
        """
        context_chunks = [
            {"content": chunk["chunk"], "metadata": chunk["meta"]}
            for chunk in chunks
        ]
        return self.generate_answer(query, context_chunks)
    def __init__(self, vector_db_path: str, collection_name: str, embedding_model_name: str, gemini_model: str = "models/gemini-2.5-flash-lite"):
        self.embedding_model = HuggingFaceEmbeddings(model_name=embedding_model_name)
        self.vector_store = Chroma(
            persist_directory=vector_db_path,
            collection_name=collection_name,
            embedding_function=self.embedding_model
        )
        # Set up Gemini
        load_dotenv()
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set.")
        genai.configure(api_key=api_key)
        self.gemini = genai.GenerativeModel(gemini_model)

    def retrieve_context(self, query: str, k: int = 3, drive: str = None, folder: str = None, file: str = None) -> List[Dict[str, Any]]:
        """
        Retrieve top-k relevant chunks for the query from the vector store, filtered by scope.
        Returns a list of dicts with content and metadata.
        """
        results = self.vector_store.similarity_search(query, k=k)
        filtered = []
        for doc in results:
            meta = doc.metadata
            if drive and meta.get('drive') != drive:
                continue
            if folder and meta.get('folder') != folder:
                continue
            if file and meta.get('file') != file:
                continue
            filtered.append({
                "content": doc.page_content,
                "metadata": meta
            })
        return filtered

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Run Gemini with the query and retrieved context.
        Returns the answer and citations.
        """
        context_text = "\n".join([chunk["content"] for chunk in context_chunks])
        prompt = f"Answer the following question using the provided context.\nContext:\n{context_text}\n\nQuestion: {query}\nAnswer:"
        response = self.gemini.generate_content(prompt)
        answer = response.text.strip() if hasattr(response, 'text') else str(response)
        citations = [chunk["metadata"] for chunk in context_chunks]
        return {
            "answer": answer,
            "citations": citations
        }

    def run(self, query: str, k: int = 3, drive: str = None, folder: str = None, file: str = None) -> Dict[str, Any]:
        """
        Full RAG pipeline: retrieve context (optionally scope-aware), generate answer, return with citations.
        """
        context_chunks = self.retrieve_context(query, k=k, drive=drive, folder=folder, file=file)
        return self.generate_answer(query, context_chunks)
