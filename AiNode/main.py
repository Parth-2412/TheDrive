# main.py
import argparse
import logging
from file_processor import FileProcessor
from vector_store_handler import VectorStoreHandler

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main(file_path: str):
    """
    Orchestrates the file processing and embedding pipeline.
    """
    logging.info(f"Starting pipeline for file: {file_path}")
    
    # 1. Initialize the handlers
    processor = FileProcessor()
    vector_store = VectorStoreHandler()
    
    # 2. Process the file to get chunks with metadata
    processed_docs = processor.process(file_path)
    
    # 3. If processing is successful, add to the vector store
    if processed_docs:
        vector_store.add_documents(processed_docs)
        logging.info(f"Pipeline completed successfully for file: {file_path}")
        # To prove scope-awareness, let's print the metadata of the first chunk
        print("\n--- Scope-Aware Metadata of First Chunk ---")
        print(processed_docs[0].metadata)
        print("-----------------------------------------")
    else:
        logging.error(f"Pipeline failed for file: {file_path}")

if __name__ == "__main__":
    # --- Setup Command-Line Argument Parsing ---
    parser = argparse.ArgumentParser(description="Process and embed a file into the vector store.")
    parser.add_argument("--file", type=str, required=True, help="The path to the file to process.")
    args = parser.parse_args()
    
    main(args.file)