# file_views.py
import os
import uuid
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db import transaction, connection

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
# MINIO CLIENT CONFIGURATION
# ============================================================================

MINIO_BUCKET = os.getenv('MINIO_BUCKET_NAME', 'thedrive')
def get_minio_client():
    """Get configured MinIO client"""
    minio_client = Minio(
        endpoint=os.getenv('MINIO_ENDPOINT'),
        access_key=os.getenv('MINIO_ACCESS_KEY'),
        secret_key=os.getenv('MINIO_SECRET_KEY'),
        secure=os.getenv('MINIO_SECURE', 'False').lower() == 'true'
    )
    if not minio_client.bucket_exists(MINIO_BUCKET):
        minio_client.make_bucket(MINIO_BUCKET)
    return minio_client

# ============================================================================
# SERIALIZERS
# ============================================================================

class FolderSerializer(serializers.ModelSerializer):
    """Serializer for folder operations"""
    parent = serializers.CharField()
    class Meta:
        model = Folder
        fields = ['id', 'name_encrypted', 'parent', 'created_at', 'updated_at', 'folder_name_hash']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_parent(self, value):
        if value == 'root':
            return None
        
        if value:
            request = self.context.get('request')
            if not Folder.objects.filter(id=value, user=request.user).exists():
                raise serializers.ValidationError("Parent folder not found or access denied")
        return value


class FileSerializer(serializers.ModelSerializer):
    """Serializer for file operations"""

    download_url = serializers.SerializerMethodField()
    folder = serializers.CharField()
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
        if value == 'root':
            return None
        
        if value:
            request = self.context.get('request')
            if not Folder.objects.filter(id=value, user=request.user).exists():
                raise serializers.ValidationError("Parent folder not found or access denied")
        return value

class RenameFileSerializer(FileSerializer):
    """Serializer for rename operations"""
    class Meta(FileSerializer.Meta):
        fields = ['name_encrypted', 'file_name_hash']
        read_only_fields = []
class RenameFolderSerializer(FolderSerializer):
    """Serializer for rename operations"""
    class Meta(FolderSerializer.Meta):
        fields = ['name_encrypted', 'folder_name_hash']
        read_only_fields = []


class MoveSerializer(serializers.Serializer):
    """Serializer for move operations"""
    destination_folder_id = serializers.CharField(help_text="Destination folder ID")
    
    def validate_destination_folder_id(self, value):
        if value == 'root':
            return None
        request = self.context.get('request')
        if not Folder.objects.filter(id=value, user=request.user).exists():
            raise serializers.ValidationError("Destination folder not found or access denied")
        return value


class CopySerializer(FileSerializer):
    """Serializer for copy operations"""
    destination_folder_id = serializers.CharField(help_text="Destination folder ID")
    class Meta(FileSerializer.Meta):
        read_only_fields = []
    
    def validate_destination_folder_id(self, value):
        if value == 'root':
            return None
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
    folder = serializers.CharField()

    class Meta(FileSerializer.Meta):
        # Add the JSON-only fields to input schema
        fields = ['file_data', 'name_encrypted', 'file_name_hash', 'file_hash', 'key_encrypted', 'key_encrypted_iv', 'file_iv', 'folder']
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
        folder_id = validated_data.pop('folder')
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
            "folder_id": folder_id,
        })

        file_instance = super().create(validated_data)


        return file_instance






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
                folder_name_hash=serializer.validated_data.get('folder_name_hash'),
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

    # folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    check = None
    check = None if folder_id == 'root' else get_object_or_404(Folder, id=folder_id, user=request.user)

    subfolders = Folder.objects.filter(parent=check, user=request.user).order_by('created_at')
    files = File.objects.filter(folder=check, user=request.user).order_by('created_at')

    
    data = {
        'folders': FolderSerializer(subfolders, many=True, context={'request': request}).data,
        'files': FileSerializer(files, many=True, context={'request': request}).data
    }
    
    return Response(data)


@extend_schema(
    operation_id='rename_folder',
    summary='Rename a folder',
    description='Rename the specified folder',
    request=RenameFolderSerializer,
    responses={200: FolderSerializer},
    tags=['Folders']
)
@api_view(['PATCH'])
def rename_folder(request, folder_id):
    """Rename a folder"""
    folder = get_object_or_404(Folder, id=folder_id, user=request.user)
    serializer = RenameFolderSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            folder.name_encrypted = serializer.validated_data['name_encrypted']
            folder.folder_name_hash = serializer.validated_data['folder_name_hash']
            folder.save()
            return Response(FolderSerializer(folder, context={'request': request}).data)
                
        except Exception as e:
            return Response(
                {'error': f'Failed to rename folder: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def collect_files(folder_id):
    # Prepare the SQL query
    query = """
        WITH RECURSIVE folder_hierarchy AS (
            -- Base case: Start with the given folder
            SELECT id
            FROM folders
            WHERE id = %s
            
            UNION ALL
            
            -- Recursive case: Find all subfolders
            SELECT f.id
            FROM folders f
            JOIN folder_hierarchy fh ON f.parent_id = fh.id
        )
        SELECT f.id, f.name
        FROM files f
        WHERE f.folder_id IN (SELECT id FROM folder_hierarchy);
    """

    # Execute the query with the given folder_id
    with connection.cursor() as cursor:
        cursor.execute(query, [folder_id])
        result = cursor.fetchall()

    return [r[0] for r in result]  # Returns a list of tuples [(id,), ...]

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
        files_to_delete = collect_files(folder)
        folder.delete()
            
        # Delete from MinIO
        for file in files_to_delete:
            try:
                minio_client.remove_object(MINIO_BUCKET,get_file_path({ "id" : file}))
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
        response = minio_client.get_object(MINIO_BUCKET, f"{file_record.id}.enc")
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
    request=RenameFileSerializer,
    responses={200: FileSerializer},
    tags=['Files']
)
@api_view(['PATCH'])
def rename_file(request, file_id):
    """Rename a file"""
    file_record = get_object_or_404(File, id=file_id, user=request.user)
    serializer = RenameFileSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Update encrypted name
            file_record.name_encrypted = serializer.validated_data['name_encrypted']
            file_record.file_name_hash = serializer.validated_data['file_name_hash']
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
        new_name = serializer.validated_data.get('name_encrypted')
        new_file_id = uuid.uuid4()
        new_minio_path = f'{new_file_id}.enc'
        minio_client = get_minio_client()
        try:
            
            destination_folder_id = serializer.validated_data['destination_folder_id']
            
            copy_source = {'Bucket': MINIO_BUCKET, 'Key': get_file_path(file_record)}
            minio_client.copy_object(
                bucket_name=MINIO_BUCKET,
                object_name=new_minio_path,
                source=copy_source
            )
                # Create new file record
            new_file = File.objects.create(
                id=new_file_id,
                user=request.user,
                folder_id=destination_folder_id,
                name_encrypted=new_name,
                file_name_hash=serializer.validated_data.get('file_name_hash'),
                file_size=file_record.file_size,
                file_hash=file_record.file_hash,  # Same content, same hash
                key_encrypted=serializer.validated_data.get('key_encrypted'),  
                key_encrypted_iv=serializer.validated_data.get('key_encrypted_iv'),
                file_iv=serializer.validated_data.get('file_iv'), 
                ai_enabled=file_record.ai_enabled
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
            #TODO delete minio new file on error
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
        minio_path = get_file_path(file_record)
        with transaction.atomic():
            file_record.delete()
            minio_client.remove_object(MINIO_BUCKET, minio_path)
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete file: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class SetFolderAISerializer(serializers.Serializer):
    value = serializers.BooleanField(required=True)

@extend_schema(
    operation_id='set_folder_ai',
    summary='Enable AI on a folder',
    description='Enable AI on all the files in the folder sub tree',
    request=SetFolderAISerializer,
    responses={204: None},
    tags=['Folders']
)
@api_view(['PUT'])
def set_folder_ai(request, folder_id):
    """Set AI Mode on all the files in the folder sub tree"""
    if folder_id != "root":
        get_object_or_404(Folder, id=folder_id, user=request.user)
    else:
        folder_id = None
    enable = bool(request.data.get('value', False))
    try:
        # Recursive query to get all files in the folder and its subfolders
        user_id = request.user.id
        print(folder_id,user_id)
        if folder_id is None:
            query = """
                UPDATE files
                SET ai_enabled = %s
                WHERE user_id = %s;
            """
        else:
            query = """
                WITH RECURSIVE folder_hierarchy AS (
                -- Base case: Start with the given folder
                SELECT id
                FROM folders
                WHERE id = %s AND user_id = %s
                
                UNION ALL
                
                -- Recursive case: Find all subfolders
                SELECT f.id
                FROM folders f
                JOIN folder_hierarchy fh ON f.parent_id = fh.id
                WHERE f.user_id = %s
                )
                UPDATE files
                SET ai_enabled = %s
                WHERE folder_id IN (SELECT id FROM folder_hierarchy) AND user_id = %s;
            """
        new_val =  enable
        with connection.cursor() as cursor:
            cursor.execute(query, [folder_id, user_id, user_id, new_val, user_id] if folder_id is not None else [new_val,user_id])
        return Response(status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response(
            {'error': f'Failed to set AI Mode: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ToggleFilesAISerializer(serializers.Serializer):
    file_ids = serializers.ListField(
        child=serializers.UUIDField(),  # Ensure that file_ids are integers
        required=True
    )
    value = serializers.BooleanField(required=True)

@extend_schema(
    operation_id='toggle_files_ai',
    summary='Toggle AI on multiple files',
    description='Toggle the AI-enabled state on multiple files',
    request=ToggleFilesAISerializer,
    responses={204: None},
    tags=['Files']
)
@api_view(['PATCH'])
def toggle_files_ai(request):
    """Toggle AI on multiple files"""

    # Deserialize and validate the request data
    serializer = ToggleFilesAISerializer(data=request.data)

    if serializer.is_valid():
        file_ids = serializer.validated_data['file_ids']
        value = serializer.validated_data['value']
        try:
            # Use a single query to toggle the ai_enabled field for the files that belong to the current user
            files_to_update = File.objects.filter(id__in=file_ids, user=request.user)

            if not files_to_update.exists():
                return Response(
                    {'error': 'No files found or you do not have permission to modify these files'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Perform the update with one SQL query
            updated_count = files_to_update.update(
                ai_enabled=value
            )

            if updated_count > 0:
                return Response(status=status.HTTP_204_NO_CONTENT)

            return Response(
                {'error': 'No files were updated'},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {'error': f'Failed to toggle AI on files: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # If serializer is not valid, return validation error response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='bulk_delete_files',
    summary='Bulk delete files',
    description='Delete multiple files in a single request',
    request=ToggleFilesAISerializer,
    responses={204: None},
    tags=['Files']
)
@api_view(['DELETE'])
def bulk_delete_files(request):
    """Bulk delete files"""

    # Deserialize and validate the request data
    serializer = ToggleFilesAISerializer(data=request.data)

    if serializer.is_valid():
        file_ids = serializer.validated_data['file_ids']
        try:
            minio_client = get_minio_client()
            files_to_delete = File.objects.filter(id__in=file_ids, user=request.user)

            if not files_to_delete.exists():
                return Response(
                    {'error': 'No files found or you do not have permission to delete these files'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Collect MinIO paths before deleting DB records
            minio_paths = [get_file_path(file) for file in files_to_delete]

            with transaction.atomic():
                deleted_count, _ = files_to_delete.delete()

                if deleted_count == 0:
                    return Response(
                        {'error': 'No files were deleted'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Delete from MinIO
                for path in minio_paths:
                    try:
                        minio_client.remove_object(MINIO_BUCKET, path)
                    except S3Error:
                        pass  # File might not exist

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response(
                {'error': f'Failed to bulk delete files: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # If serializer is not valid, return validation error response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)