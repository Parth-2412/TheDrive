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
        
        self.loader_map = {
            '.pdf': PyPDFLoader,
            '.docx': Docx2txtLoader,
            '.txt': TextLoader,
            '.pptx': UnstructuredPowerPointLoader,
            '.csv': CSVLoader,
            '.xlsx': UnstructuredExcelLoader,
            '.jpg': UnstructuredImageLoader,
            '.png': UnstructuredImageLoader,
        }

    def _generate_chunk_id(self, file_name: str, chunk_index: int, char_start: int) -> str:
        """Generate unique chunk ID for precise highlighting."""
        combined = f"{file_name}-{chunk_index}-{char_start}"
        return hashlib.md5(combined.encode()).hexdigest()[:12]

    def _extract_page_number(self, doc: Document) -> int:
        """Extract page number from document metadata."""
        if 'page' in doc.metadata:
            return doc.metadata['page']
        elif 'source' in doc.metadata:
            # Try to extract page from source string (common in PDF loaders)
            source = str(doc.metadata.get('source', ''))
            if 'page' in source:
                try:
                    return int(source.split('page')[-1].strip().split()[0])
                except:
                    pass
        return 1  # Default to page 1

    def process(self, file_path: str, original_filename: str = None, 
                user_id: str = None, scope: str = None) -> Optional[List[Document]]:
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
            
            file_name = original_filename or os.path.basename(file_path)
            
            # Add cross-referencing metadata to each chunk
            for chunk_index, chunk in enumerate(chunked_docs):
                # Get character positions from text splitter
                char_start = getattr(chunk.metadata, 'start_index', chunk_index * 1000)
                char_end = char_start + len(chunk.page_content)
                
                # Generate unique chunk ID
                chunk_id = self._generate_chunk_id(file_name, chunk_index, char_start)
                
                # Page number extraction
                page_number = self._extract_page_number(chunk)
                
                # Cross-referencing metadata
                chunk.metadata.update({
                    # File identification for source attribution
                    'file': file_name,
                    'file_path': file_path,
                    'user_id': user_id,
                    'scope': scope,
                    
                    # Precise location for highlighting
                    'chunk_id': chunk_id,
                    'chunk_index': chunk_index,
                    'page_number': page_number,
                    'char_start': char_start,
                    'char_end': char_end,
                    
                    # For file linking
                    'file_size': os.path.getsize(file_path),
                    'total_chunks': len(chunked_docs)  # Will be same for all chunks
                })
            
            logging.info(f"Processed {file_name}: {len(chunked_docs)} chunks with cross-reference metadata")
            return chunked_docs
            
        except Exception as e:
            logging.error(f"Failed to process {file_path}: {e}")
            return None
