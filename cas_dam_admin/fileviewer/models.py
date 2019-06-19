import csv
import logging

from django.db import models
from django.core.validators import FileExtensionValidator


class CSVDocument(models.Model):
    # description = models.CharField(max_length=255, blank=True)
    document = models.FileField(upload_to='documents/', validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    path = models.CharField(max_length=255)  # max_length is required, we could make it longer if needed
    uploaded_at = models.DateTimeField(auto_now_add=True)

    csv_file = None

    def save_file_to_model(self):
        """
        Opens the path to the csv document and reads it with csv.DictReader, then saves it to the document object
        :return:
        """
        with open(self.document.path, "r") as f:
            self.csv_file = csv.DictReader(f)
            logging.info("saving csv file", self.csv_file)
        self.save()
