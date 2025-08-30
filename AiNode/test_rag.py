# test_rag.py
"""
Test script for the RAG pipeline (retrieval and answer generation).
"""

from rag_pipeline import RAGPipeline
from config import settings
import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_rag.py <query>")
        sys.exit(1)
    query = sys.argv[1]

    rag = RAGPipeline(
        vector_db_path=settings.VECTOR_DB_PATH,
        collection_name=settings.VECTOR_DB_COLLECTION,
        embedding_model_name=settings.EMBEDDING_MODEL_NAME
    )
    result = rag.run(query)
    print("\n--- RAG Output ---")
    print("Answer:", result["answer"])
    print("Citations:", result["citations"])
