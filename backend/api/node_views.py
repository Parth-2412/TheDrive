from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from .models import DocumentChunk, File, Folder, DriveUser, AINode, DocumentChunk
from .serializers import DocumentChunkSerializer
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.core.exceptions import ValidationError

class ActionSerializer(serializers.Serializer):
    public_key = serializers.CharField(help_text="The user the AI node's searching for")

class GetFilesChunksSerializer(ActionSerializer):
   files = serializers.ListField(
       child=serializers.UUIDField(),
       allow_empty=False,
       help_text="List of file UUIDs to get chunks for"
   )

class CreateChunkSerializer(DocumentChunkSerializer):
    class Meta(DocumentChunkSerializer.Meta):
        fields = ['chunk_content_encrypted', 'order_in_file', 'embedding_encrypted', 'chunk_start', 'chunk_end']
class StoreFilesChunksSerializer(ActionSerializer):
    chunks = serializers.ListField(
        child=CreateChunkSerializer(),
        allow_empty=False,
        help_text="Chunks to store"
    )
    file_id = serializers.UUIDField(help_text="The file uuid to store chunks for")
    
class GetFolderChunksSerializer(ActionSerializer):
   folder_id = serializers.CharField(help_text="The folder uuid to get chunks for")

def get_user_for_ai_node(public_key : str, ai_node: AINode):
    return get_object_or_404(DriveUser, public_key=public_key, preferred_ai_node=ai_node)

@extend_schema(
    operation_id='store_chunk',
    summary='Store chunks and embeddings for a file',
    description='Store document chunks and their AI-generated embeddings for a file.',
    request=StoreFilesChunksSerializer,
    responses={201: DocumentChunkSerializer},
    tags=['Chunks']
)
@api_view(['POST'])
def store_chunks(request):
    """
    Store the chunks and their embeddings for a given file.
    """
    serializer = StoreFilesChunksSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        file_id = validated_data.pop('file_id', None)
        user_public_key = validated_data.pop('public_key', None)
        ai_node = AINode.objects.filter(public_key=request.user).first()
        user = get_user_for_ai_node(user_public_key, ai_node)
        file = get_object_or_404(File, id=file_id, user=user)
        if not file.ai_enabled:
            return Response(
                {'error': 'AI processing is not enabled for this file'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save all chunks, setting the file explicitly before saving
        chunks_data = validated_data['chunks']
        chunks = []
        for chunk in chunks_data:
            chunk['file'] = file  # Assign the file to each chunk explicitly
            chunk['ai_node'] = ai_node
            chunks.append(DocumentChunk(**chunk))

        # Bulk create the chunks
        DocumentChunk.objects.bulk_create(chunks)

        return Response(DocumentChunkSerializer(chunks, many=True).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def get_chunks_for_folder(folder_id, user):
    """
    Recursive query to get all chunks for all files in the folder and its subfolders.
    Returns a RawQuerySet of DocumentChunk instances.
    """
    if folder_id is None:

        sql_query = """
            SELECT dc.*
            FROM document_chunks dc
            INNER JOIN files f ON dc.file_id = f.id
            WHERE f.user_id = %s AND f.ai_enabled = true; 
        """
        params = [user.id]
    else:
        sql_query = """
            WITH RECURSIVE folder_tree AS (
                SELECT id, parent_id
                FROM folders
                WHERE id = %s AND user_id = %s
                
                UNION ALL
                
                SELECT f.id, f.parent_id
                FROM folders f
                INNER JOIN folder_tree ft ON f.parent_id = ft.id
                WHERE f.user_id = %s  -- Add user_id constraint in recursive part
            )
            SELECT dc.*
            FROM document_chunks dc
            INNER JOIN files f ON dc.file_id = f.id
            WHERE f.folder_id IN (SELECT id FROM folder_tree) 
            AND f.ai_enabled = true
            AND f.user_id = %s;  -- Add user_id constraint for files
        """
        params = [folder_id, user.id]


    return DocumentChunk.objects.raw(sql_query, params)

@extend_schema(
    operation_id='get_chunks_for_folder',
    summary='Get chunks/embeddings for a given folder',
    description='Get document chunks and their embeddings for the given folder',
    request=GetFolderChunksSerializer,
    responses={200: DocumentChunkSerializer(many=True)},
    tags=['Chunks']
)
@api_view(['GET'])
def get_chunks_folder(request):
    """
    Get chunks and embeddings for a given file or folder.
    """
    serializer = StoreFilesChunksSerializer(data=request.data)
    if serializer.is_valid():
        user = get_user_for_ai_node(serializer.validated_data['public_key'], AINode.objects.filter(public_key=request.user).first())
        folder_id = serializer.validated_data["folder_id"]
        # Determine if context_id refers to a file or folder
        chunk_data = None
        if folder_id == "root":
            chunk_data = get_chunks_for_folder(None, user)
        else:
            chunk_data = get_chunks_for_folder(folder_id, user)
        

        return Response(DocumentChunkSerializer(chunk_data, many=True).data)



@extend_schema(
    operation_id='get_chunks_for_files',
    summary='Get chunks/embeddings for the given files',
    description='Get document chunks and their embeddings for the given files',
    request=GetFilesChunksSerializer,
    responses={200: DocumentChunkSerializer(many=True)},
    tags=['Chunks']
)
@api_view(['GET'])
def get_chunks_files(request):
    """
    Get chunks and embeddings for the given files
    """
    serializer = GetFilesChunksSerializer(data=request.data)
    if serializer.is_valid():
        user = get_user_for_ai_node(serializer.validated_data['public_key'], AINode.objects.filter(public_key=request.user).first())
        file_ids = serializer.validated_data['files']
        valid_file_ids = File.objects.filter(user=user, file_id__in=file_ids).values_list('file_id', flat=True)
        if len(valid_file_ids) < len(file_ids):
            return Response({"error" : ""})
        chunks = DocumentChunk.objects.filter(file_id__in=valid_file_ids)
        chunk_serializer = DocumentChunkSerializer(chunks, many=True)
        return Response(chunk_serializer.data)
    else:
        return Response(serializer.errors, status=400)
    
class YesNoResponseSerializer(serializers.Serializer):
    response = serializers.ChoiceField(choices=['yes', 'no'])

@extend_schema(
    operation_id='get_chunks_for_files',
    summary='Get chunks/embeddings for the given files',
    description='Get document chunks and their embeddings for the given files',
    responses={200 : YesNoResponseSerializer},
    tags=['Chunks']
)
@api_view(['GET'])
def check_if_user(request):
    """
    Check if there exists a user 
    """
    try:
        public_key = request.query_params.get('public_key')

        get_user_for_ai_node(public_key, AINode.objects.filter(public_key=request.user).first())
        return Response({"response" : "yes"})
    except Http404 as e:
        return Response({"response" : "no"}, status=400)
    except Exception as e:
        print(f"[ERROR]: {str(e)}")
        return Response({"error" : "Something went wrong."}, status=500)
