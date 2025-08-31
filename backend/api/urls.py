from django.urls import include, path
from rest_framework import routers
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from .auth_views import AuthenticationViewSet
from . import file_views
from . import node_views
router = routers.DefaultRouter(trailing_slash=False)
router.register('', AuthenticationViewSet, basename='auth')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('auth/', include(router.urls)),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('folders/', file_views.create_folder, name='create_folder'),
    path('folders/<folder_id>/', file_views.list_folder_contents, name='list_folder_contents'),
    path('folders/<uuid:folder_id>/rename/', file_views.rename_folder, name='rename_folder'),
    path('folders/<uuid:folder_id>/delete/', file_views.delete_folder, name='delete_folder'),
    
    # File endpoints
    path('files/', file_views.upload_file, name='upload_file'),
    path('files/<uuid:file_id>/download/', file_views.download_file, name='download_file'),
    path('files/<uuid:file_id>/rename/', file_views.rename_file, name='rename_file'),
    path('files/<uuid:file_id>/copy/', file_views.copy_file, name='copy_file'),
    path('files/<uuid:file_id>/move/', file_views.move_file, name='move_file'),
    path('files/<uuid:file_id>/delete/', file_views.delete_file, name='delete_file'),
    path('files/<uuid:file_id>/toggle/', file_views.toggle_ai_enable_file, name='toggle_ai_enable_file'),
]