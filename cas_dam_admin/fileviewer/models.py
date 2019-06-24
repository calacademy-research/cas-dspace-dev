import csv
import logging

import dspace_python_wrapper
from django.core.validators import FileExtensionValidator
from django.db import models

logging.basicConfig(level=logging.INFO)


class CSVDocument(models.Model):
    document = models.FileField(upload_to='documents/', validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    path = models.CharField(max_length=255)  # max_length is required, we could make it longer if needed
    uploaded_at = models.DateTimeField(auto_now_add=True)

    headers_textfield = models.TextField()
    list_of_json_rows_textfield = models.TextField()

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



        upload_requests = []
        for line in list_of_json_rows:
            r = requests.post(self.rest_api_base_url + "/")