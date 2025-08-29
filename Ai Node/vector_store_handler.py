# vector_store_handler.py
import logging
from typing import List
from langchain.docstore.document import Document

# --- CORRECTED IMPORTS using the latest packages ---
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from config import settings

class VectorStoreHandler:
    """Handles embedding and storing documents in ChromaDB."""
    def __init__(self):
        logging.info("Initializing VectorStoreHandler and loading embedding model...")
        # Use the new, recommended class from langchain_huggingface
        self.embedding_model = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL_NAME)
        self.persist_directory = settings.VECTOR_DB_PATH
        self.collection_name = settings.VECTOR_DB_COLLECTION
        logging.info("Embedding model loaded successfully.")

    def add_documents(self, documents: List[Document]):
        """Creates embeddings and stores them in the vector store."""
        if not documents:
            logging.warning("No documents provided to add to the vector store.")
            return
        
        logging.info(f"Adding {len(documents)} document chunks to collection '{self.collection_name}'...")
        Chroma.from_documents(
            documents=documents,
            embedding=self.embedding_model,
            collection_name=self.collection_name,
            persist_directory=self.persist_directory
        )
        logging.info("Successfully added documents to the vector store.")