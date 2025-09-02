# file_processor.py

import os
import logging
from typing import List, Optional
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader,
    UnstructuredPowerPointLoader,
    CSVLoader,
    UnstructuredExcelLoader,
    UnstructuredImageLoader,
)
import hashlib

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FileProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, 
            chunk_overlap=chunk_overlap,
            add_start_index=True  # Adds character positions for highlighting
        )
        
        # Text-based file extensions
        self.text_extensions = [
            '.txt', '.sh', '.html', '.htm', '.xml', '.json', '.yaml', '.yml',
            '.md', '.markdown', '.js', '.ts', '.jsx', '.tsx', '.css', '.scss',
            '.sass', '.py', '.java', '.cpp', '.c', '.h', '.hpp', '.php', '.rb',
            '.go', '.rs', '.sql', '.log', '.conf', '.config', '.ini', '.env',
            '.gitignore', '.dockerfile', '.makefile'
        ]
        
        self.loader_map = {
            '.pdf': PyPDFLoader,
            '.docx': Docx2txtLoader,
            '.pptx': UnstructuredPowerPointLoader,
            '.csv': CSVLoader,
            '.xlsx': UnstructuredExcelLoader,
            '.jpg': UnstructuredImageLoader,
            '.png': UnstructuredImageLoader,
        }
        
        # Add text extensions to loader map
        for ext in self.text_extensions:
            self.loader_map[ext] = TextLoader


    
    def process(self, file_path: str, original_filename: str = None) -> Optional[List[Document]]:
        """
        Process file with cross-referencing metadata for source attribution and highlighting.
        """
        file_extension = os.path.splitext(file_path)[1].lower()
        loader_class = self.loader_map.get(file_extension)

        if not loader_class:
            logging.warning(f"Unsupported file type: {file_extension}")
            return None

        logging.info(f"Processing {file_path} using {loader_class.__name__}...")
        
        try:
            loader = loader_class(file_path)
            raw_docs = loader.load()
            
            # Split documents with positional tracking
            chunked_docs = self.text_splitter.split_documents(raw_docs)
            
            file_name = original_filename
            
            # Add cross-referencing metadata to each chunk
            for chunk_index, chunk in enumerate(chunked_docs):
                # Get character positions from text splitter
                char_start = getattr(chunk.metadata, 'start_index', chunk_index * 1000)
                char_end = char_start + len(chunk.page_content)

                
                # Cross-referencing metadata
                chunk.metadata.update({
                    # File identification for source attribution
                    'order_in_file': chunk_index,
                    'chunk_start': char_start,
                    'chunk_end': char_end,
                })
            
            logging.info(f"Processed {file_name}: {len(chunked_docs)} chunks with cross-reference metadata")
            return chunked_docs
            
        except Exception as e:
            logging.error(f"Failed to process {file_path}: {e}")
            return None
