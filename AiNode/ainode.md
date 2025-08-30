
# AI Node: Detailed Technical Overview

## Purpose
The AI Node is a secure, autonomous backend service for privacy-preserving, AI-powered document search, chat, and contextual analysis in decentralized cloud storage. It processes, embeds, and answers queries over user data without ever seeing user keys or storing plaintext content.

---

## Core Functionalities

### 1. **AI-Enablement (Ingestion/Preprocessing)**
**Goal:** Prepare user files for AI-powered search and chat.

- User marks file/folder as "AI-enabled" in the client UI.
- Client decrypts the file locally (any format: PDF, DOCX, PPTX, XLSX, image, etc.).
- Client sends the decrypted file (in its native format) to the AI Node over TLS.
- **AI Node processing:**
  - Detects file type and uses the appropriate loader:
    - **PDF/DOCX/TXT:** Extracts text, chunks by tokens or sections.
    - **PPTX:** Extracts text from slides/notes, chunks by slide or section.
    - **XLSX:** Extracts tables, chunks by sheet or logical region, preserves table structure for aggregation.
    - **Images:** Uses OCR for text or image captioning for description; each image or region is a chunk.
  - Generates embeddings for each chunk.
  - Encrypts all chunks/embeddings with a user-specific key (never stored on the node).
  - Returns encrypted chunks/embeddings to the server for storage.

### 2. **Query/Chat (RAG, Highlight, Aggregation)**
**Goal:** Answer user queries using only the selected, AI-enabled files/folders.

- User initiates a chat or query session, selecting files/folders.
- Server sends encrypted chunks/embeddings (for those files) to the AI Node.
- AI Node decrypts and loads them into session memory (RAM only).
- For each query:
  - **RAG pipeline** retrieves relevant chunks and generates an answer using LLMs.
  - **Highlight-based queries:** Uses highlighted text/image/table region as the query.
  - **Aggregation/metadata queries:** Runs requested metrics (sum, count, etc.) over table data.
  - **Citation/cross-reference:** Returns file, chunk, and location for each answer.
- All responses include citations and are generated in-memory; nothing is persisted after session ends.

---

## API Endpoints
- `/ingest`: Ingest and AI-enable files/folders (chunk, embed, encrypt, return encrypted data).
- `/chat/drive`, `/chat/folder`, `/chat/file`: Contextual chat endpoints (accept encrypted embeddings/chunks, decrypt, answer).
- `/highlight/text`, `/highlight/image`, `/highlight/table`: Highlight-based query endpoints.
- `/aggregate`: Aggregation/metadata queries.
- `/citation/link`: Cross-reference and citation resolution.
- `/health`: Health check.

---

## Security & Privacy
- Zero-knowledge: No plaintext or keys ever stored server-side or on the AI Node.
- All communication is over TLS 1.3.
- User-specific encryption for all embeddings/chunks.
- Session-based access; instant revocation possible by deleting encrypted chunks.

---

## Technology Stack
- **Backend:** FastAPI (Python)
- **Vector DB:** ChromaDB (or compatible)
- **ML Models:** Sentence Transformers, HuggingFace, Gemini, etc.
- **WebSocket:** For real-time chat (future extension)

---

## Deployment & Operation
- Open-source; anyone can run an AI Node.
- Registers with platform for authorization.
- Users select node based on trust and features.

---

## Example Workflow
1. User marks file as AI-enabled.
2. Client decrypts and sends file (any format) to AI Node.
3. AI Node loads, chunks, embeds, encrypts, and returns data for storage.
4. User starts a chat session, selecting files/folders.
5. Server sends encrypted embeddings to AI Node.
6. AI Node decrypts, loads context, and answers queries with citations.
7. Session ends; all data is purged from AI Node memory.

---

## Extensibility
- Add new file loaders, models, or vector DBs as needed.
- UI integration is seamless via API endpoints.
- Designed for privacy, security, and modularity.

---

*This document describes the final architecture and features of the AI Node as part of a decentralized, privacy-preserving cloud AI ecosystem, with accurate technical details based on the actual implementation plan.*
