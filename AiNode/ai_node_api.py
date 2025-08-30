
from sqlalchemy import text

# ai_node_api.py
"""
FastAPI app for AI Node chat and contextual query endpoints.
"""

from fastapi import FastAPI, Query, Body, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

import mimetypes
import io
import tempfile
import os

# Import your actual file processor and embedding logic here
from file_processor import FileProcessor
from langchain_huggingface import HuggingFaceEmbeddings
from db import SessionLocal
from models import AIChunk
from sqlalchemy.exc import SQLAlchemyError
import asyncio


app = FastAPI(title="AI Node API", description="APIs for contextual chat and queries over drive data.")

# Placeholder for actual RAG pipeline and logic imports
# from rag_pipeline import RAGPipeline

class ChatRequest(BaseModel):
    query: str
    k: Optional[int] = 3
    drive: Optional[str] = None
    folder: Optional[str] = None
    file: Optional[str] = None

class HighlightRequest(BaseModel):
    file: str
    text: str
    start: Optional[int] = None
    end: Optional[int] = None


# --- Ingestion Endpoint ---
@app.post("/ingest")
async def ingest(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    scope: str = Form(...)
):
    """
    Ingest and AI-enable a file: chunk, embed, encrypt, and return encrypted data for storage.
    Accepts any file type (PDF, DOCX, PPTX, XLSX, image, etc.).
    """
    # 1. Read file content
    file_bytes = await file.read()
    filename = file.filename
    content_type = file.content_type or mimetypes.guess_type(filename)[0]


    # 2. Detect file type and process
    processor = FileProcessor()
    # Use tempfile for cross-platform compatibility
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp_file:
        tmp_file.write(file_bytes)
        temp_path = tmp_file.name

    try:
        # 3. Chunk and extract content
        processed_docs = processor.process(temp_path, original_filename=filename)
        if not processed_docs:
            return {"error": "Unsupported or failed to process file type."}
        # Ensure all chunks have correct scope metadata
        for doc in processed_docs:
            doc.metadata['scope'] = scope
    finally:
        # Clean up temp file
        os.remove(temp_path)

    # 4. Generate real embeddings using HuggingFaceEmbeddings
    embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    texts = [doc.page_content for doc in processed_docs]
    embeddings = embedder.embed_documents(texts)

    # 5. Store in NeonDB
    chunk_ids = []
    try:
        async with SessionLocal() as session:
            for doc, emb in zip(processed_docs, embeddings):
                chunk_obj = AIChunk(chunk=doc.page_content, embedding=emb, meta=doc.metadata)
                session.add(chunk_obj)
            await session.commit()
            # Retrieve IDs of inserted chunks
            await session.refresh(chunk_obj)
            chunk_ids = [chunk_obj.id for chunk_obj in session.new]
    except SQLAlchemyError as e:
        return {"error": f"Database error: {str(e)}"}

    # 6. Return summary
    return {
        "file": filename,
        "num_chunks": len(processed_docs),
        "chunk_ids": chunk_ids,
    "meta": [doc.metadata for doc in processed_docs]
    }

from fastapi import HTTPException
from rag_pipeline import RAGPipeline
# --- RAG Chat by Scope Endpoint ---
class RAGRequest(BaseModel):
    query: str
    scope: str

@app.post("/chat/scope")
async def chat_scope(request: RAGRequest):
    """
    RAG chat endpoint: takes a query and a scope, fetches only chunks with that scope, runs RAG pipeline, returns answer.
    """
    try:
        async with SessionLocal() as session:
            # Fetch all chunks for the given scope
            result = await session.execute(
                text("SELECT chunk, embedding, meta FROM ai_chunks WHERE LOWER(meta->>'scope') = LOWER(:scope)"),
                {"scope": request.scope}
            )
            rows = result.mappings().all()
            if not rows:
                raise HTTPException(status_code=404, detail=f"No chunks found for scope '{request.scope}'")
            # Use RAGPipeline to generate answer from these chunks
            rag = RAGPipeline(
                vector_db_path="AiNode/chroma_db",  # adjust if needed
                collection_name="default",           # adjust if needed
                embedding_model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            rag_result = rag.run_with_chunks(request.query, rows)
        return {
            "query": request.query,
            "scope": request.scope,
            **rag_result,
            "num_chunks": len(rows),
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# # --- Chat Endpoints ---
# @app.post("/chat/drive")
# def chat_drive(request: ChatRequest):
#     """Chat over the whole drive context."""
#     # TODO: Integrate with RAGPipeline for drive-level context
#     return {"message": "Drive-level chat endpoint (stub)", "query": request.query}

# @app.post("/chat/folder")
# def chat_folder(request: ChatRequest):
#     """Chat over a specific folder context."""
#     # TODO: Integrate with RAGPipeline for folder-level context
#     return {"message": "Folder-level chat endpoint (stub)", "query": request.query, "folder": request.folder}

# @app.post("/chat/file")
# def chat_file(request: ChatRequest):
#     """Chat over a specific file context."""
#     # TODO: Integrate with RAGPipeline for file-level context
#     return {"message": "File-level chat endpoint (stub)", "query": request.query, "file": request.file}

# # --- Highlight-Based Query Endpoints ---
# @app.post("/highlight/text")
# def highlight_text(request: HighlightRequest):
#     """AI popup for highlighted text (definition, explanation, etc.)."""
#     # TODO: Implement text highlight-based AI popup
#     return {"message": "Text highlight endpoint (stub)", "file": request.file, "text": request.text}

# @app.post("/highlight/image")
# def highlight_image(file: str = Body(...), region: Dict[str, Any] = Body(...)):
#     """AI popup for selected image region."""
#     # TODO: Implement image region-based AI popup
#     return {"message": "Image highlight endpoint (stub)", "file": file, "region": region}

# @app.post("/highlight/table")
# def highlight_table(file: str = Body(...), table_region: Dict[str, Any] = Body(...)):
#     """AI popup for selected table region (aggregation, metrics, etc.)."""
#     # TODO: Implement table region-based AI popup
#     return {"message": "Table highlight endpoint (stub)", "file": file, "table_region": table_region}

# # --- Aggregation/Metadata Query Endpoint ---
# @app.post("/aggregate")
# def aggregate_query(query: str = Body(...), scope: Optional[Dict[str, Any]] = Body(None)):
#     """Aggregation/metadata queries over files/folders/tables."""
#     # TODO: Implement aggregation/metadata queries
#     return {"message": "Aggregation endpoint (stub)", "query": query, "scope": scope}

# # --- Citation/Cross-Reference Endpoint ---
# @app.post("/citation/link")
# def citation_link(citation: Dict[str, Any] = Body(...)):
#     """Given a citation, return file path and chunk location."""
#     # TODO: Implement citation linking
#     return {"message": "Citation link endpoint (stub)", "citation": citation}
