from django.db import models
from django.utils import timezone


# Create your models here.
class SubmittedData(models.Model):
    upload_user = models.CharField(max_length=128)
    # upload_time = models.DateTimeField(default=timezone.now)
    upload_time = models.DateTimeField(auto_now_add=True)
    collection_uuid = models.CharField(max_length=36)

    def __str__(self):
        return "Upload by " + self.upload_user + " at " + str(self.upload_time)

    class Meta:
        verbose_name_plural = "Submitted Data"
        verbose_name = "Submitted Datum"


class Item(models.Model):
    class Meta:
        verbose_name_plural = "Items"
        verbose_name = "Item"

    source_submission = models.ForeignKey(SubmittedData, on_delete=models.CASCADE)
    uuid = models.CharField(max_length=36, primary_key=True)
    metadata = models.TextField()
    filepath = models.TextField(null=True)

    # TODO: should we track bitstream uuid?
    # if we delete the main item, what happens to the bitstream?

    def __str__(self):
        return "Item with UUID " + self.uuid + " uploaded by " + self.source_submission.upload_user + " at " + str(self.source_submission.upload_time)
