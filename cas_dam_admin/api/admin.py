from django.contrib import admin
from .models import Item, SubmittedData

# Register your models here.
admin.register(Item)(admin.ModelAdmin)
admin.register(SubmittedData)(admin.ModelAdmin)
