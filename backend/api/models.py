# Create your models here.
# models.py
import uuid
from django.db import models

class DriveUser(models.Model):
    """
    Custom user model identified by seed phrase
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Remove username, use RSA public key as identifier
    username = None
    
    # public key derived from seed phrase (user's identity)
    public_key = models.TextField(unique=True, help_text="RSA public key derived from seed phrase")
    
   
    
    # DriveUser preferences
    preferred_ai_node = models.ForeignKey(
        'AINode', 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        help_text="DriveUser's preferred AI node for queries"
    )
    
    storage_used = models.BigIntegerField(default=0, help_text="Storage used in bytes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'public_key'
    REQUIRED_FIELDS = []

   
    class Meta:
        db_table = 'drive_users'


class AINode(models.Model):
    """
    AI nodes that can process user data - like blockchain nodes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=255, help_text="Human readable name")
    
    # AI node's RSA key pair (generated at build)
    public_key = models.TextField(unique=True, help_text="AI node's RSA public key")
    
    # Network details
    endpoint_url = models.URLField(help_text="AI node's API endpoint")
    
    # Authorization and trust
    is_authorized = models.BooleanField(
        default=False, 
        help_text="Whether this AI node is authorized by app owners"
    )
    
    # Stats
    total_users = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_nodes'


class StorageEntity(models.Model):
    """
    Abstract base class for hierarchical storage entities (folders and files)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.ForeignKey(DriveUser, on_delete=models.CASCADE)
    
    # Encrypted name (encrypted with parent's key or user's root key)
    name_encrypted = models.BinaryField()
    
    # Entity's own encryption key (user's master key)
    key_encrypted = models.BinaryField()
    
    # Storage path
    minio_path = models.TextField()
    
    # AI settings
    ai_enabled = models.BooleanField(default=False)
    ai_processing_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Folder(StorageEntity):
    """
    Hierarchical folder structure
    """
    # Override user field with custom related_name and help text
    user = models.ForeignKey(
        DriveUser, 
        on_delete=models.CASCADE, 
        related_name='folders'
    )
    
    # Hierarchical structure
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, blank=True,
        related_name='subfolders',
        help_text="Parent folder - null for root folders"
    )
    
    class Meta:
        db_table = 'folders'
        indexes = [
            models.Index(fields=['user', 'parent']),
            models.Index(fields=['user', 'ai_enabled']),
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set help text for inherited fields
        self._meta.get_field('name_encrypted').help_text = "Folder name encrypted with parent folder's key"
        self._meta.get_field('key_encrypted').help_text = "This folder's symmetric key encrypted with parent folder's key"
        self._meta.get_field('minio_path').help_text = "Full folder path for fast hierarchical queries"
        self._meta.get_field('ai_enabled').help_text = "Whether files in this folder are AI-searchable"


class File(StorageEntity):
    """
    Individual files in the storage system
    """
    # Override user field with custom related_name
    user = models.ForeignKey(
        DriveUser, 
        on_delete=models.CASCADE, 
        related_name='files'
    )
    
    # File belongs to a folder
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='files')
    
    # File-specific fields
    file_size = models.BigIntegerField(help_text="File size in bytes")
    file_type = models.CharField(max_length=10, help_text="File type/extension")
    
    # Additional AI processing field for files
    ai_processed_at = models.DateTimeField(null=True, blank=True)
    
    # Checksums for integrity
    file_hash = models.CharField(
        max_length=64, 
        help_text="SHA-256 hash of encrypted file for integrity"
    )
    
    class Meta:
        db_table = 'files'
        indexes = [
            models.Index(fields=['user', 'folder']),
            models.Index(fields=['user', 'ai_enabled']),
            models.Index(fields=['ai_processing_status']),
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set help text for inherited fields
        self._meta.get_field('name_encrypted').help_text = "Original filename encrypted with folder key"
        self._meta.get_field('key_encrypted').help_text = "This file's symmetric key encrypted with folder key"
        self._meta.get_field('minio_path').help_text = "Path in MinIO object storage"
        self._meta.get_field('ai_enabled').help_text = "Whether this file is AI-searchable"
    
class DocumentChunk(models.Model):
    """
    Vector embeddings for document chunks (stored encrypted on server for Option 2)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    chunk_content_encrypted = models.BinaryField(help_text="Chunk content encrypted with AI node's public key")
    
    order_in_file = models.PositiveBigIntegerField(help_text="Order of the chunk in the file")

    # the file it belongs to
    file = models.ForeignKey(File, on_delete=models.CASCADE, help_text="The file the chunk belongs to")

    # Encrypted embedding vector (encrypted with AI node's public key)
    embedding_encrypted = models.BinaryField(help_text="Vector embedding encrypted with AI node's public key")
    
    # Embedding metadata
    ai_node = models.ForeignKey(AINode, on_delete=models.CASCADE)

    embedding_dimension = models.IntegerField(help_text="Vector dimension")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_chunk'
        indexes = []

