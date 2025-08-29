from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import DocumentChunk, File, Folder
from .serializers import DocumentChunkSerializer
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

@extend_schema(
    operation_id='store_chunk',
    summary='Store chunks and embeddings for a file',
    description='Store document chunks and their AI-generated embeddings for a file.',
    request=DocumentChunkSerializer,
    responses={201: DocumentChunkSerializer},
    tags=['Chunks']
)
@api_view(['POST'])
def store_chunks(request, file_id):
    """
    Store the chunks and their embeddings for a given file.
    """
    file = get_object_or_404(File, id=file_id, user=request.user)
    
    # Validate the file and check if the file is AI-enabled for embedding processing
    if not file.ai_enabled:
        return Response(
            {'error': 'AI processing is not enabled for this file'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = DocumentChunkSerializer(data=request.data, context={'request': request, 'file': file})
    if serializer.is_valid():
        serializer.save(file=file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .models import DocumentChunk

def get_chunks_for_folder(folder_id, user):
    """
    Recursive query to get all chunks for all files in the folder and its subfolders.
    Returns a RawQuerySet of DocumentChunk instances.
    """
    if folder_id is None:
        # NOTE: Use the actual table names Django creates (e.g., 'yourapp_documentchunk')
        sql_query = """
            SELECT dc.*
            FROM api_document_chunk dc
            INNER JOIN api_file f ON dc.file_id = f.id
            WHERE f.user_id = %s;
        """
        params = [user.id]
    else:
        sql_query = """
            WITH RECURSIVE folder_tree AS (
                SELECT id, parent_id
                FROM api_folder
                WHERE id = %s AND user_id = %s
                UNION ALL
                SELECT f.id, f.parent_id
                FROM api_folder f
                INNER JOIN folder_tree ft ON f.parent_id = ft.id
            )
            SELECT dc.*
            FROM api_document_chunk dc
            INNER JOIN api_file f ON dc.file_id = f.id
            WHERE f.folder_id IN (SELECT id FROM folder_tree);
        """
        params = [folder_id, user.id]

    # This one line replaces your entire manual loop.
    # It's safer, cleaner, and the idiomatic Django way.
    return DocumentChunk.objects.raw(sql_query, params)

@extend_schema(
    operation_id='get_chunks_for_context',
    summary='Get chunks/embeddings for a given context (folder/file)',
    description='Get document chunks and their embeddings for the given file or folder context.',
    responses={200: DocumentChunkSerializer(many=True)},
    tags=['Chunks']
)
@api_view(['GET'])
def get_chunks(request, context_id):
    """
    Get chunks and embeddings for a given file or folder.
    """
    # Determine if context_id refers to a file or folder
    if context_id == "null":
        chunk_data = get_chunks_for_folder(None, request.user)
    try:
        folder = Folder.objects.get(id=context_id, user=request.user)
        # If it's a folder, get chunks for all files in the folder (recursively)
        chunk_data = get_chunks_for_folder(folder.id, request.user)
    except Folder.DoesNotExist:
        try:
            file = File.objects.get(id=context_id, user=request.user)
            # If it's a file, return the chunks for that file
            chunk_data = DocumentChunk.objects.filter(file=file)
        except File.DoesNotExist:
            return Response({"error": "Invalid context ID"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Serialize and return the chunk data
    serializer = DocumentChunkSerializer(chunk_data, many=True)
    return Response(serializer.data)
