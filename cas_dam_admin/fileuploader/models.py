from django.db import models
from django.core.validators import FileExtensionValidator



class CSVDocument(models.Model):
    # description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='documents/', validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    uploaded_at = models.DateTimeField(auto_now_add=True)
