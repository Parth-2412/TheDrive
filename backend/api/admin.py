from django.contrib import admin
from .models import DriveUser, AINode, Folder, File
# Register your models here.

all_models = [DriveUser,AINode,Folder,File]

for model in all_models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass