from rest_framework.parsers import JSONParser
from .serializers import DriveUserSerializer, NonceSerializer
from .models import DriveUser, AuthNonce
import secrets
from django.utils import timezone
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from backend.settings import SIMPLE_JWT
from rest_framework_simplejwt.exceptions import TokenError
from .crypto import verify_signature
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from rest_framework.permissions import AllowAny
from drf_spectacular.plumbing import build_object_type


# 2️⃣ Login Request (request a nonce)
class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField(help_text="The username of the DriveUser")

# 3️⃣ Nonce Response
class NonceResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthNonce
        fields = ['nonce', 'challenge_message', 'expires_at']

# 4️⃣ Login Verify Request (send signature)
class LoginVerifySerializer(serializers.Serializer):
    username = serializers.CharField()
    nonce = serializers.CharField()
    signature = serializers.CharField(help_text="ED25519 signature of the challenge message")

# 5️⃣ Token Refresh Request
class TokenRefreshSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(help_text="JWT refresh token")

# 6️⃣ Token Response
class TokenResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()

class AuthenticationViewSet(viewsets.ViewSet):
    """
    ViewSet for authentication operations
    """
    authentication_classes = []  # unprotected
    permission_classes = [AllowAny]

    @extend_schema(
        request=DriveUserSerializer,
        responses={201: DriveUserSerializer, 400: OpenApiResponse(description="Validation errors")},
        description="Register a new DriveUser"
    )
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """
        POST /auth/register - Register a new user
        """
        data = JSONParser().parse(request)
        serializer = DriveUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @extend_schema(
        request=TokenRefreshSerializer,
        responses={200: TokenResponseSerializer, 400: OpenApiResponse(description="Invalid request")},
        description="Refresh JWT token"
    )
    @action(detail=False, methods=['post'], url_path='token/refresh')
    def token_refresh(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=400)
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token
            
            return Response({
                'access_token': str(access_token),
                'refresh_token': str(refresh) if SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS') else refresh_token
            })
        except TokenError:
            return Response({'error': 'Invalid refresh token'}, status=401)

    @extend_schema(
        request=LoginRequestSerializer,
        responses={200: NonceResponseSerializer, 400: OpenApiResponse(description="Validation errors")},
        description="Request a nonce for login"
    )
    @action(detail=False, methods=['post'], url_path='login/request')
    def login_request(self, request):
        data = JSONParser().parse(request)
        username = data.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=400)
        
        try:
            user = DriveUser.objects.get(username=username)
        except DriveUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        # Clean up expired nonces
        AuthNonce.objects.filter(user=user, expires_at__lt=timezone.now()).delete()
        
        # Generate nonce
        nonce = secrets.token_hex(32)
        timestamp = int(timezone.now().timestamp())
        challenge_message = f"Sign this message to authenticate:\nNonce: {nonce}\nTimestamp: {timestamp}\nUsername: {username}"
        
        auth_nonce = AuthNonce.objects.create(
            user=user,
            nonce=nonce,
            challenge_message=challenge_message
        )
        serializer = NonceSerializer(auth_nonce)
        return Response(serializer.data, status=200)


    @extend_schema(
        request=LoginVerifySerializer,
        responses={200: TokenResponseSerializer, 401: OpenApiResponse(description="Invalid signature")},
        description="Verify signature and obtain JWT"
    )
    @action(detail=False, methods=['post'], url_path='login/verify')
    def login_verify(self, request):
        data = JSONParser().parse(request)
        username = data.get('username')
        nonce = data.get('nonce')
        signature = data.get('signature')
        if not all([username, nonce, signature]):
            return Response({'error': 'Username, nonce, and signature are required'}, status=400)
        
        try:
            user = DriveUser.objects.get(username=username)
            auth_nonce = AuthNonce.objects.get(nonce=nonce, user=user)
        except (DriveUser.DoesNotExist, AuthNonce.DoesNotExist):
            return Response({'error': 'Invalid credentials'}, status=401)
        
        if not auth_nonce.is_valid():
            return Response({'error': 'Nonce expired or already used'}, status=401)
        
        if not verify_signature(auth_nonce.challenge_message, signature, user.public_key):
            return Response({'error': 'Invalid signature'}, status=401)
        
        auth_nonce.used = True
        auth_nonce.save()
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            'message': 'Authentication successful',
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'user_id': str(user.id),
            'username': user.username
        }, status=200)
