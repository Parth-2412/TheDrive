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

    path('folders/<folder_id>/set_folder_ai/', file_views.set_folder_ai, name='set_folder_ai'),
    
    # File endpoints
    path('files/', file_views.upload_file, name='upload_file'),
    path('files/bulk_delete/', file_views.bulk_delete_files, name='bulk_delete_files'),
    path('files/<uuid:file_id>/download/', file_views.download_file, name='download_file'),
    path('files/<uuid:file_id>/rename/', file_views.rename_file, name='rename_file'),
    path('files/<uuid:file_id>/copy/', file_views.copy_file, name='copy_file'),
    path('files/<uuid:file_id>/move/', file_views.move_file, name='move_file'),
    path('files/<uuid:file_id>/delete/', file_views.delete_file, name='delete_file'),
    path('files/toggle/', file_views.toggle_files_ai, name='toggle_files_ai'),
    path('files/get_file_names/', file_views.get_file_names, name='get_file_names'),
    path('files/<uuid:file_id>/get_file_family/', file_views.get_file_family, name='get_file_family'),

    #chunk endpoints
    path('chunks/store/', node_views.store_chunks, name='store_chunks'),
    path('chunks/folder/', node_views.get_chunks_folder, name='get_chunks_folder'),
    path('chunks/files/', node_views.get_chunks_files, name='get_chunks_files'),
    path('is_user', node_views.check_if_user, name='is_user'),
]