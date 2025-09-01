from django.contrib import admin
from .models import DriveUser, AINode, Folder, File

# Base ModelAdmin that includes all fields, but handles relations properly
class AllFieldsAdmin(admin.ModelAdmin):
    
    def get_readonly_fields(self, request, obj=None):
        # Make 'created_at' and 'updated_at' readonly
        readonly_fields = [field.name for field in self.model._meta.get_fields() if field.name in ['created_at', 'updated_at', 'last_login']]
        return readonly_fields

# Register the models with the customized ModelAdmin
all_models = [DriveUser, AINode, Folder, File]

for model in all_models:
    try:
        admin.site.register(model, AllFieldsAdmin)
    except admin.sites.AlreadyRegistered:
        pass
