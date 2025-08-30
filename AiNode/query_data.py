# query_data.py
import logging
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from config import settings

# --- Basic Logging Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def query_vector_store():
    """
    Connects to the existing ChromaDB, performs a similarity search,
    and prints the results.
    """
    logging.info("Loading embedding model...")
    # We need the same embedding model that was used to store the data
    embedding_model = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL_NAME)
    
    logging.info(f"Connecting to vector store at: {settings.VECTOR_DB_PATH}")
    # Connect to the existing database on disk
    vector_store = Chroma(
        persist_directory=settings.VECTOR_DB_PATH,
        collection_name=settings.VECTOR_DB_COLLECTION,
        embedding_function=embedding_model
    )
    
    # Get a query from the user
    query = input("\nEnter a search query (e.g., 'Kanpur' or 'report') and press Enter: ")
    if not query:
        print("No query entered. Exiting.")
        return

    logging.info(f"Searching for documents similar to: '{query}'")
    # Perform the similarity search
    results = vector_store.similarity_search(query, k=3) # k=3 means get the top 3 results
    
    print("\n--- Search Results ---")
    if not results:
        print("No matching documents found.")
    else:
        for i, doc in enumerate(results):
            print(f"\n--- Result {i+1} ---")
            print(f"Content: {doc.page_content}")
            print(f"Metadata (Source): {doc.metadata}")
            print("--------------------")

if __name__ == "__main__":
    query_vector_store()