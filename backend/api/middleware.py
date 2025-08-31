from django.http import JsonResponse, HttpRequest
from django.urls import resolve
from django.utils.deprecation import MiddlewareMixin
from typing import Optional

class AINodeRequiredMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
       self.get_response = get_response
       # Define paths that require AI node
       self.protected_paths = [
           
       ]
       super().__init__(get_response)
   
    def process_request(self, request: HttpRequest) -> Optional[JsonResponse]:
        # Skip if user is not authenticated
        if not request.user.is_authenticated:
            return None
        
        # Check if current path requires AI node
        try:
            current_url_name = resolve(request.path_info).url_name
            if current_url_name not in self.protected_paths:
                return None
        except:
            # If using path patterns instead of URL names
            if not any(request.path_info.startswith(path) for path in self.protected_paths):
                return None
        
        # Check if user has AI node
        if not hasattr(request.user, 'ai_node') or request.user.ai_node is None:
            return JsonResponse(
                {'error': 'AI node access required'}, 
                status=403
            )
        
        return None