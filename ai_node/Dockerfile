# ai_node/Dockerfile
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir sentence-transformers
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

ENV DEBIAN_FRONTEND=noninteractive

# Install Tesseract runtime and (optional) English lang data + Pillow deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libjpeg62-turbo \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 ainode && chown -R ainode:ainode /app
USER ainode

# Create cache directory for models
RUN mkdir -p /app/model_cache
RUN chown -R ainode:ainode /app/model_cache

# Add environment variable for cache directory
ENV TRANSFORMERS_CACHE="/app/model_cache"
ENV HF_HOME="/app/model_cache"

# Expose port
EXPOSE $PORT

# Run the application
CMD ["python3", "api.py"]