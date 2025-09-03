## Architecture and Worklow
Can be found at `doc.md`

## Setup the .env file in the root folder
```
MINIO_ROOT_USER=placeholder
MINIO_ROOT_PASSWORD=placeholder
MINIO_BUCKET_NAME=thedrive
POSTGRES_DB=thedrive
POSTGRES_USER=placeholder
POSTGRES_PASSWORD=placeholder

# MinIO Configuration
MINIO_ROOT_USER=placeholder
MINIO_ROOT_PASSWORD=placeholder
MINIO_BUCKET_NAME=thedrive

# Backend PostgreSQL Configuration
POSTGRES_DB=thedrive
POSTGRES_USER=placeholder
POSTGRES_PASSWORD=placeholder

# AI Node PostgreSQL Configuration (separate database)
AI_NODE_DB_NAME=ragdb
AI_NODE_DB_USER=placeholder
AI_NODE_DB_PASSWORD=placeholder

AI_NODE_PUBLIC_KEY=IN_HEX
AI_NODE_PRIVATE_KEY=IN_HEX
AI_NODE_MASTER_KEY=IN_HEX

GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

# Environment
ENVIRONMENT=development

```

- Setup the username passwords as you want
- To get the AI node cryptographic credentials (public key, private key, master key), run `python3 ai_node/script.py` and copy it exactly into the .env section where AI node cryptographic credentials are defined

## Running
- To run the app, you need docker-compose and docker installed and the docker daemon running
- Then in the root folder run `docker-compose up --build`