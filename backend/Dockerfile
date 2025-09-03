# Use official Python image from the Docker Hub
FROM python:3.12-slim

# Set environment variables to avoid interactive prompts during package installations
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the Django project files into the container

# Expose the port the app will run on
EXPOSE 8000

# Set the command to run the initialization script
CMD ["python3", "initialize_system.py"]

