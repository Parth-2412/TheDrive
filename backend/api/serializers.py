from .models import DriveUser, AuthNonce, DocumentChunk
from rest_framework import serializers

class DriveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveUser
        fields = ['id', 'username', 'public_key', 'preferred_ai_node', 'created_at', 'last_login']

class NonceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthNonce
        fields = ['nonce', 'challenge_message', 'expires_at']
        read_only_fields = ['nonce', 'challenge_message', 'expires_at']

class DocumentChunkSerializer(serializers.ModelSerializer):
    """Serializer for document chunks and their embeddings."""
    
    class Meta:
        model = DocumentChunk
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        """
        Additional validation (optional, such as ensuring chunk order is unique for a file).
        """
        # Validate that order_in_file is unique for a given file
        file = self.context.get('file')
        if DocumentChunk.objects.filter(file=file, order_in_file=data['order_in_file']).exists():
            raise serializers.ValidationError('Chunk order already exists for this file.')
        return data
