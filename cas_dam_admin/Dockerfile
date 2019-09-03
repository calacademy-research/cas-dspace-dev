FROM python:3

ADD . /django-project

WORKDIR /django-project

RUN pip install -r requirements.txt

#CMD [ "echo" ]
CMD [ "python", "/django-project/manage.py runserver 0:8000" ]
