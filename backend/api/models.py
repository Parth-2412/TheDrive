# Create your models here.
# models.py
import uuid
from django.db import models
import secrets
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
    

class DriveUserManager(BaseUserManager):
    def create_user(self, public_key, username=None, password=None, **extra_fields):
        if not public_key:
            raise ValueError("Users must have a public key")
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(public_key=public_key, username=username, **extra_fields)

        # For normal users → no password
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, public_key, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not password:
            raise ValueError("Superusers must have a password")

        return self.create_user(public_key, username=username, password=password, **extra_fields)


class DriveUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    public_key = models.TextField(unique=True)
    username = models.CharField(unique=True, max_length=255)

    preferred_ai_node = models.ForeignKey(
        "AINode",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )


    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"   # admin login via username
    REQUIRED_FIELDS = ["public_key"]

    objects = DriveUserManager()

    class Meta:
        db_table = "drive_users"

    def __str__(self):
        return self.username

    

class AINode(models.Model):
    """
    AI nodes that can process user data - like blockchain nodes
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=255, help_text="Human readable name")
    
    # AI node's RSA key pair (generated at build)
    public_key = models.TextField(unique=True, help_text="AI node's ED25519 public key")
    
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
    name_encrypted = models.TextField()

    
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
        unique_together = [('parent', 'name_encrypted')]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set help text for inherited fields
        self._meta.get_field('name_encrypted').help_text = "Folder name encrypted with drive mastery key"
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
    file_type = models.CharField(max_length=255, help_text="File type/extension")
    
    # Additional AI processing field for files
    ai_processed_at = models.DateTimeField(null=True, blank=True)
    
    # Checksums for integrity
    file_hash = models.CharField(
        max_length=64, 
        help_text="SHA-256 hash of encrypted file for integrity"
    )
    
    # File's own encryption key (user's master key)
    key_encrypted = models.TextField(help_text = "This file's symmetric key encrypted with the drive master key, in base64 format")
    file_iv = models.TextField(help_text = "In base64")
    key_encrypted_iv = models.TextField(help_text = "In base64")

    class Meta:
        db_table = 'files'
        indexes = [
            models.Index(fields=['user', 'folder']),
            models.Index(fields=['user', 'ai_enabled']),
            models.Index(fields=['ai_processing_status']),
        ]
        unique_together = [('folder', 'name_encrypted')]

    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set help text for inherited fields
        self._meta.get_field('name_encrypted').help_text = "Original filename encrypted with drive master key"
        self._meta.get_field('ai_enabled').help_text = "Whether this file is AI-searchable"

    
class DocumentChunk(models.Model):
    """
    Vector embeddings for document chunks (stored encrypted on server for Option 2)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    chunk_content_encrypted = models.TextField(help_text="Chunk content encrypted by the AI node")
    
    order_in_file = models.PositiveBigIntegerField(help_text="Order of the chunk in the file")

    # the file it belongs to
    file = models.ForeignKey(File, on_delete=models.CASCADE, help_text="The file the chunk belongs to")

    # Encrypted embedding vector (encrypted with AI node's public key)
    embedding_encrypted = models.TextField(help_text="Vector embedding encrypted by the AI node")
    
    # Embedding metadata
    ai_node = models.ForeignKey(AINode, on_delete=models.CASCADE)

    embedding_dimension = models.IntegerField(help_text="Vector dimension")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_chunk'
        indexes = []

class AuthNonce(models.Model):
    """Nonce for authentication challenges"""
    user = models.ForeignKey('DriveUser', on_delete=models.CASCADE, related_name='nonces')
    nonce = models.CharField(max_length=64, unique=True)
    challenge_message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['nonce']),
            models.Index(fields=['expires_at']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.nonce:
            self.nonce = secrets.token_hex(32)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=5)  # 5 min expiry
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at