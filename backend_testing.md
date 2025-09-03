# TheDrive Backend API Documentation (for Postman Testing)

This document provides a comprehensive reference for testing the TheDrive backend API using Postman. All endpoints are prefixed with `/api/` unless otherwise noted. Authentication is required for most endpoints via JWT tokens, except for registration and login.

---

## 1. User Registration & Authentication

### Register User
- **POST** `/api/register/`
- **Body (JSON):**
  - `public_key` (string): User's ED25519 public key
- **Response:**
  - `user_id`, `public_key`

### Login (Challenge Request)
- **POST** `/api/login/challenge/`
- **Body (JSON):**
  - `public_key` (string): User's ED25519 public key
- **Response:**
  - `challenge` (string)

### Login (Challenge Response)
- **POST** `/api/login/verify/`
- **Body (JSON):**
  - `public_key` (string)
  - `signature` (string): Signature of challenge
- **Response:**
  - `access` (JWT), `refresh` (JWT)

### Refresh Token
- **POST** `/api/token/refresh/`
- **Body (JSON):**
  - `refresh` (JWT)
- **Response:**
  - `access` (JWT)

---

## 2. File & Folder Management

### Upload File
- **POST** `/api/files/upload/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Body (form-data):**
  - `file` (binary): Encrypted file
  - `metadata` (JSON): Encrypted filename, wrapped key, IV, etc.
- **Response:**
  - `file_id`, `status`

### List Files/Folders
- **GET** `/api/files/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Response:**
  - List of files/folders (encrypted names, IDs, metadata)

### Download File
- **GET** `/api/files/<file_id>/download/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Response:**
  - Encrypted file (binary)

### Delete File
- **DELETE** `/api/files/<file_id>/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Response:**
  - `status`

### Create Folder
- **POST** `/api/folders/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Body (JSON):**
  - `name_encrypted` (string)
  - `parent_id` (optional)
- **Response:**
  - `folder_id`, `status`

---

## 3. AI Node & Ingestion

### Enable AI for File
- **POST** `/api/files/<file_id>/enable_ai/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Response:**
  - `status`

### Store AI Chunks
- **POST** `/api/chunks/store/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Body (JSON):**
  - `file_id`, `chunks` (list of encrypted chunks)
- **Response:**
  - `status`

---

## 4. User & Node Verification

### Verify User (for AI Node)
- **POST** `/api/is_user/`
- **Body (JSON):**
  - `public_key` (string)
- **Response:**
  - `is_valid` (bool)

### Register AI Node
- **POST** `/api/ainode/register/`
- **Body (JSON):**
  - `public_key` (string)
- **Response:**
  - `node_id`, `status`

---

## 5. Miscellaneous

### Get User Info
- **GET** `/api/user/`
- **Headers:**
  - `Authorization: Bearer <access_token>`
- **Response:**
  - User details (public key, etc.)

### Health Check
- **GET** `/api/health/`
- **Response:**
  - `status: ok`

---

## Notes for Postman Testing
- Set `Content-Type` to `application/json` for JSON requests.
- Use `form-data` for file uploads.
- Always include the `Authorization` header with the JWT access token for protected endpoints.
- All file and metadata fields are encrypted client-side.

---