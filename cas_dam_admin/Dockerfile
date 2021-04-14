FROM python:3.7

ADD . /cas_dam_admin

WORKDIR /cas_dam_admin
RUN pip install -r requirements.txt
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y build-essential nodejs
WORKDIR /cas_dam_admin/frontend
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
WORKDIR /cas_dam_admin

RUN rm -f db.sqlite3
#RUN python3 manage.py migrate

#CMD [ "echo" ]
CMD [ "python3", "manage.py", "runserver", "0:8000" ]
