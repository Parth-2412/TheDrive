# test_ingestion.py
"""
Test script for the ingestion pipeline (file processing, chunking, embedding).
"""

from file_processor import FileProcessor
from vector_store_handler import VectorStoreHandler
import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_ingestion.py <file_path>")
        sys.exit(1)
    file_path = sys.argv[1]

    # Process the file
    processor = FileProcessor()
    chunks = processor.process(file_path)
    if not chunks:
        print("File processing failed or returned no chunks.")
        sys.exit(1)
    print(f"Processed {len(chunks)} chunks. Example metadata:")
    print(chunks[0].metadata)

    # Store in vector DB
    vector_store = VectorStoreHandler()
    vector_store.add_documents(chunks)
    print("Chunks embedded and stored in vector DB.")
