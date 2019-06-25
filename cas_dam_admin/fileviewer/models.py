import csv
import json
import logging
import os

from django.core.validators import FileExtensionValidator
from django.db import models

from dspace_python_wrapper import Dspace

logging.basicConfig(level=logging.INFO)


class CSVDocument(models.Model):
    document = models.FileField(upload_to='documents/', validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    path = models.CharField(max_length=255)  # max_length is required, we could make it longer if needed
    uploaded_at = models.DateTimeField(auto_now_add=True)

    email = models.EmailField()
    password = models.TextField()

    collection_uuid = models.CharField(max_length=36)

    rest_api_base_url = models.TextField(default="http://localhost:8080/rest")

    headers_textfield = models.TextField(default="")
    list_of_json_rows_textfield = models.TextField(default="")

    def save_file_to_model(self):
        """
        Opens the path to the csv document and reads it with csv.DictReader, then saves it to the document object
        :return:
        """

        headers = []
        list_of_json_rows = []

        with open(self.document.path, "r") as f:
            # TODO verify there is data in the csv file
            csv_file = csv.reader(f)
            for line in csv_file:
                if not headers:
                    headers = line
                    continue

                list_of_json_rows.append(dict(zip(headers, line)))

            logging.info("saving csv file, %s", self.uploaded_at)

        self.headers_textfield = repr(headers)
        self.list_of_json_rows_textfield = repr(list_of_json_rows)
        self.save()

    def log_csv_contents(self):

        headers = eval(self.headers_textfield)
        list_of_json_rows = eval(self.list_of_json_rows_textfield)

        if list_of_json_rows is None:
            logging.error("No CSV rows saved to this object")

        logging.info("%s", ', '.join(headers))
        for line in list_of_json_rows:
            logging.info("%s", ', '.join(line.values()))

    # TODO use requests to post each line of the csv file. Remember to use http:// in url,
    # TODO r.cookies['JSESSIONID'] to get authorization cookie after logging in

    def upload_csv_to_dspace(self):
        headers = eval(self.headers_textfield)
        list_of_json_rows = eval(self.list_of_json_rows_textfield)

        dspace_controller = Dspace(self.rest_api_base_url)

        dspace_controller.login('test@test.edu', 'test')

        for line in list_of_json_rows:

            filepath = line['filename']
            filename = line['ibss-library.filename']

            full_filepath = os.path.join(self.path, filepath.lstrip("/"))

            item_uuid, response = dspace_controller.register_new_item_from_json(line, self.collection_uuid)

            bitstream_response = dspace_controller.add_bitstream_to_item(full_filepath, filename, item_uuid)

            logging.info("Bitstream response: %s", bitstream_response)
