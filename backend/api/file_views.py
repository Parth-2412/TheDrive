# file_views.py
import os
import uuid
import hashlib
import mimetypes

from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers

from drf_spectacular.utils import extend_schema

from minio import Minio
from minio.error import S3Error

from .models import Folder, File
from dotenv import load_dotenv
import base64
import io

load_dotenv()

# ============================================================================
# SERIALIZERS
# ============================================================================

class FolderSerializer(serializers.ModelSerializer):
    """Serializer for folder operations"""
    
    class Meta:
        model = Folder
        fields = ['id', 'name_encrypted', 'parent', 'ai_enabled', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_parent(self, value):
        if value == None:
            return value
        if value:
            request = self.context.get('request')
            if not Folder.objects.filter(id=value, user=request.user).exists():
                raise serializers.ValidationError("Parent folder not found or access denied")
        return value


class FileSerializer(serializers.ModelSerializer):
    """Serializer for file operations"""

    download_url = serializers.SerializerMethodField()
    
    class Meta:
        model = File
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_download_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/api/files/{obj.id}/download/')
        return None

    def validate_folder(self, value):
        request = self.context.get('request')
        if not Folder.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Folder not found or access denied")
        return value


class RenameSerializer(FileSerializer):
    """Serializer for rename operations"""
    class Meta(FileSerializer.Meta):
        fields = ['name_encrypted']
        read_only_fields = []


class MoveSerializer(serializers.Serializer):
    """Serializer for move operations"""
    destination_folder_id = serializers.UUIDField(help_text="Destination folder ID")
    
    def validate_destination_folder_id(self, value):
        request = self.context.get('request')
        if not Folder.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Destination folder not found or access denied")
        return value


class CopySerializer(FileSerializer):
    """Serializer for copy operations"""
    destination_folder_id = serializers.UUIDField(help_text="Destination folder ID")
    class Meta(FileSerializer.Meta):
        fields = ['name_encrypted', 'key_encrypted', 'key_encrypted_iv', 'file_iv', 'destination_folder_id']
        read_only_fields = []
    
    def validate_destination_folder_id(self, value):
        request = self.context.get('request')
        if not Folder.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Destination folder not found or access denied")
        return value


class FolderContentsSerializer(serializers.Serializer):
    """Serializer for folder contents response"""
    folders = FolderSerializer(many=True, read_only=True)
    files = FileSerializer(many=True, read_only=True)

class FileUploadSerializer(FileSerializer):
    """ModelSerializer extended for JSON-based uploads"""

    # Extra JSON-only fields
    file_data = serializers.CharField(write_only=True, help_text="Base64-encoded encrypted file")


    class Meta(FileSerializer.Meta):
        # Add the JSON-only fields to input schema
        fields = ['file_data', 'name_encrypted', 'key_encrypted', 'key_encrypted_iv', 'file_iv', 'folder_id']
        read_only_fields = []

    def create(self, validated_data):
        request = self.context.get("request")

        # Pop JSON-only fields
        file_b64 = validated_data.pop("file_data")

        # Decode base64 file data
        try:
            file_bytes = base64.b64decode(file_b64)
        except Exception:
            raise serializers.ValidationError({"file_data": "Invalid base64 file"})

        # Prepare metadata
        file_id = uuid.uuid4()
        minio_path = f"{file_id}.enc"
        file_size = len(file_bytes)
        file_hash = hashlib.sha256(file_bytes).hexdigest()

        # Upload to MinIO
        minio_client = get_minio_client()
        content_type = "application/octet-stream"

        minio_client.put_object(
            bucket_name=MINIO_BUCKET,
            object_name=minio_path,
            data=io.BytesIO(file_bytes),
            length=file_size,
            content_type=content_type
        )

        # Save DB record
        validated_data.update({
            "id": file_id,
            "user": request.user,
            "file_size": file_size,
            "file_hash": file_hash,
        })

        file_instance = super().create(validated_data)


        return file_instance

# ============================================================================
# MINIO CLIENT CONFIGURATION
# ============================================================================

def get_minio_client():
    """Get configured MinIO client"""
    return Minio(
        endpoint=os.getenv('MINIO_ENDPOINT', 'localhost:9000'),
        access_key=os.getenv('MINIO_ACCESS_KEY', 'parth2412'),
        secret_key=os.getenv('MINIO_SECRET_KEY', 'parth2412'),
        secure=os.getenv('MINIO_SECURE', 'False').lower() == 'true'
    )

MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'thedrive')


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================



def get_file_path(file: File) -> str:
    """Get full file path using IDs"""
    return f"{file.id}.enc"


# ============================================================================
# FOLDER ENDPOINTS
# ============================================================================

@extend_schema(
    operation_id='create_folder',
    summary='Create a new folder',
    description='Create a new folder in the specified parent directory',
    request=FolderSerializer,
    responses={201: FolderSerializer},
    tags=['Folders']
)
@api_view(['POST'])
def create_folder(request):
    """Create a new folder"""
    serializer = FolderSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        try:
            folder = Folder.objects.create(
                user=request.user,
                name_encrypted=serializer.validated_data['name_encrypted']              ,
                parent_id=serializer.validated_data.get('parent'),
                ai_enabled=serializer.validated_data.get('ai_enabled', False)
            )
            
            
            response_serializer = FolderSerializer(folder, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to create folder: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='list_folder_contents',
    summary='List folder contents',
    description='Get all files and subfolders in the specified folder',
    responses={200: FolderContentsSerializer},
    tags=['Folders']
)
@api_view(['GET'])
def list_folder_contents(request, folder_id):
    """List contents of a folder"""
    folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    
    subfolders = Folder.objects.filter(parent=folder).order_by('created_at')
    files = File.objects.filter(folder=folder).order_by('created_at')
    
    data = {
        'folders': FolderSerializer(subfolders, many=True, context={'request': request}).data,
        'files': FileSerializer(files, many=True, context={'request': request}).data
    }
    
    return Response(data)


@extend_schema(
    operation_id='rename_folder',
    summary='Rename a folder',
    description='Rename the specified folder',
    request=RenameSerializer,
    responses={200: FolderSerializer},
    tags=['Folders']
)
@api_view(['PATCH'])
def rename_folder(request, folder_id):
    """Rename a folder"""
    folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    serializer = RenameSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            folder.name_encrypted = serializer.validated_data['name_encrypted']
            folder.save()
            return Response(FolderSerializer(folder, context={'request': request}).data)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to rename folder: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@extend_schema(
    operation_id='delete_folder',
    summary='Delete a folder',
    description='Delete the specified folder and all its contents',
    responses={204: None},
    tags=['Folders']
)
@api_view(['DELETE'])
def delete_folder(request, folder_id):
    """Delete a folder and all its contents"""
    folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    
    try:
        minio_client = get_minio_client()
        
        with transaction.atomic():
            # Get all files in this folder and subfolders for MinIO deletion
            def collect_files(folder : Folder):
                files = []
                for file in folder.files.all():
                    files.append(file)
                for subfolder in folder.subfolders.all():
                    files.extend(collect_files(subfolder))
                return files
            
            files_to_delete = collect_files(folder)
            
            # Delete from database (cascade will handle children)
            folder.delete()
            
            # Delete from MinIO
            for file in files_to_delete:
                try:
                    minio_client.remove_object(MINIO_BUCKET,get_file_path(file))
                except S3Error:
                    pass  # File might not exist
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete folder: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@extend_schema(
    operation_id='move_folder',
    summary='Move a folder',
    description='Move the specified folder to a different folder',
    request=MoveSerializer,
    responses={200: FolderSerializer},
    tags=['Files']
)
@api_view(['PATCH'])
def move_folder(request, folder_id):
    """Move a folder to a different folder"""
    folder_record = get_object_or_404(Folder, id=folder_id, user=request.user)
    serializer = MoveSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        try:
            destination_folder_id = serializer.validated_data['destination_folder_id']
            folder_record.parent_id = destination_folder_id
            folder_record.save()
            return Response(FolderSerializer(folder_record, context={'request': request}).data)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to move file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ============================================================================
# FILE ENDPOINTS
# ============================================================================

@extend_schema(
    operation_id='upload_file',
    summary='Upload a file',
    description='Upload a file to the specified folder (base64 JSON payload)',
    request=FileUploadSerializer,
    responses={201: FileSerializer},
    tags=['Files']
)
@api_view(['POST'])
def upload_file(request):
    serializer = FileUploadSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    file_instance = serializer.save()
    return Response(FileSerializer(file_instance, context={'request': request}).data, status=status.HTTP_201_CREATED)


@extend_schema(
    operation_id='download_file',
    summary='Download a file',
    description='Download/stream the specified file',
    responses={200: FileSerializer},
    tags=['Files']
)
@api_view(['GET'])
def download_file(request, file_id):
    """Download an encrypted file from MinIO as base64 JSON"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)

    try:
        minio_client = get_minio_client()

        # Fetch file object from MinIO
        response = minio_client.get_object(MINIO_BUCKET, file_record.minio_path)
        file_bytes = response.read()
        response.close()
        response.release_conn()

        # Base64 encode ciphertext
        file_b64 = base64.b64encode(file_bytes).decode("utf-8")

        # Build JSON response
        data =FileSerializer(file_record, context={'request': request}).data

        data["file_data"] = file_b64

        return Response(data, status=status.HTTP_200_OK)

    except S3Error as e:
        return Response(
            {"error": f"File not found in storage: {str(e)}"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Failed to download file: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@extend_schema(
    operation_id='rename_file',
    summary='Rename a file',
    description='Rename the specified file',
    request=RenameSerializer,
    responses={200: FileSerializer},
    tags=['Files']
)
@api_view(['PATCH'])
def rename_file(request, file_id):
    """Rename a file"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)
    serializer = RenameSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Update encrypted name
            file_record.name_encrypted = serializer.validated_data['name_encrypted']
            file_record.save()
            
            return Response(FileSerializer(file_record, context={'request': request}).data)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to rename file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    operation_id='move_file',
    summary='Move a file',
    description='Move the specified file to a different folder',
    request=MoveSerializer,
    responses={200: FileSerializer},
    tags=['Files']
)
@api_view(['PATCH'])
def move_file(request, file_id):
    """Move a file to a different folder"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)
    serializer = MoveSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        try:
            destination_folder_id = serializer.validated_data['destination_folder_id']
            file_record.folder_id = destination_folder_id
            file_record.save()
            return Response(FileSerializer(file_record, context={'request': request}).data)
            
        except Exception as e:
            return Response(
                {'error': f'Failed to move file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    operation_id='copy_file',
    summary='Copy a file',
    description='Create a copy of the specified file',
    request=CopySerializer,
    responses={201: FileSerializer},
    tags=['Files']
)
@api_view(['POST'])
def copy_file(request, file_id):
    """Copy a file"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)
    serializer = CopySerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        try:
            minio_client = get_minio_client()
            
            with transaction.atomic():
                destination_folder_id = serializer.validated_data['destination_folder_id']
                
                new_name = serializer.validated_data.get('name_encrypted')
                new_minio_path = f'{new_file.id}.enc'

                 # Create new file record
                new_file = File.objects.create(
                    user=request.user,
                    folder_id=destination_folder_id,
                    name_encrypted=new_name,
                    minio_path=new_minio_path,
                    file_size=file_record.file_size,
                    file_type=file_record.file_type,
                    file_hash=file_record.file_hash,  # Same content, same hash
                    key_encrypted=serializer.validated_data.get('key_encrypted'),  
                    key_encrypted_iv=serializer.validated_data.get('key_encrypted_iv'),
                    file_iv=serializer.validated_data.get('file_iv'), 
                    ai_enabled=file_record.ai_enabled
                )
                
                # Copy file in MinIO
                copy_source = {'Bucket': MINIO_BUCKET, 'Key': get_file_path(file_record)}
                minio_client.copy_object(
                    bucket_name=MINIO_BUCKET,
                    object_name=new_minio_path,
                    source=copy_source
                )
                
                return Response(
                    FileSerializer(new_file, context={'request': request}).data,
                    status=status.HTTP_201_CREATED
                )
        
        except S3Error as e:
            return Response(
                {'error': f'Storage error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to copy file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='delete_file',
    summary='Delete a file',
    description='Delete the specified file',
    responses={204: None},
    tags=['Files']
)
@api_view(['DELETE'])
def delete_file(request, file_id):
    """Delete a file"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)
    
    try:
        minio_client = get_minio_client()
        
        with transaction.atomic():
            file_size = file_record.file_size
            minio_path = get_file_path(file_record)
            
            # Delete from database
            file_record.delete()
            
            # Delete from MinIO
            try:
                minio_client.remove_object(MINIO_BUCKET, minio_path)
            except S3Error:
                pass  # File might not exist in storage
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete file: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )