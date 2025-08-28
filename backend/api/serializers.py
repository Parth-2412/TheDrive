from .models import DriveUser, AuthNonce
from rest_framework import serializers

class DriveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriveUser
        fields = ['id', 'username', 'public_key', 'preferred_ai_node', 'storage_used', 'created_at', 'last_login']

class NonceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthNonce
        fields = ['nonce', 'challenge_message', 'expires_at']
        read_only_fields = ['nonce', 'challenge_message', 'expires_at']