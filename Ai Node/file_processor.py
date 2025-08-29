# file_processor.py
import os
import logging
from typing import List, Optional
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# --- CORRECTED IMPORTS ---
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader,
    UnstructuredPowerPointLoader, # <- This is the change
    CSVLoader,
    UnstructuredExcelLoader,
    UnstructuredImageLoader,
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FileProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        
        # --- CORRECTED LOADER MAP ---
        self.loader_map = {
            '.pdf': PyPDFLoader,
            '.docx': Docx2txtLoader,
            '.txt': TextLoader,
            '.pptx': UnstructuredPowerPointLoader, # <- This is the change
            '.csv': CSVLoader,
            '.xlsx': UnstructuredExcelLoader,
            '.jpg': UnstructuredImageLoader,
            '.png': UnstructuredImageLoader,
        }

    def process(self, file_path: str) -> Optional[List[Document]]:
        """
        Processes a single file.
        Returns: A list of Document objects with text and metadata.
        """
        file_extension = os.path.splitext(file_path)[1].lower()
        loader_class = self.loader_map.get(file_extension)

        if not loader_class:
            logging.warning(f"Unsupported file type: {file_extension} for file: {file_path}")
            return None

        logging.info(f"Processing {file_path} using {loader_class.__name__}...")
        try:
            loader = loader_class(file_path)
            docs_with_metadata = loader.load()
            chunked_docs = self.text_splitter.split_documents(docs_with_metadata)
            logging.info(f"Split {file_path} into {len(chunked_docs)} chunks.")
            return chunked_docs
        except Exception as e:
            logging.error(f"Failed to process file {file_path}: {e}")
            return None