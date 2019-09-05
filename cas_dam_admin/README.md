# Running the server in Docker
Replace `DSPACE_URL=http://dspace:8080/rest` with the url for your instance of dSpace
```
docker run -p 8000:8000 
--env DSPACE_URL=http://dspace:8080/rest 
--name django_docker 
-h=`hostname`
cas_dam_docker
```

If you are running dSpace in a docker container, you will need to add this container to the dspace network by adding: 
`--net=d6_dspacenet`

## Running without docker:
You need to set the environment variable to the url of dspace
`export DSPACE_URL=http://localhost:8080/rest`

#Getting started for development:

Create virtual env:

```
mkdir venv
cd venv
python3 venv -m .
pip install -r requirements.txt
```

Before using/running:

`source ./venv/bin/activate`

Google API Credentials:

In order to use any of the Google Drive API services, a `credentials.json` files is needed.
Go to https://developers.google.com/drive/api/v3/quickstart/python, click on "Enable The Drive API", and select "Download Client Configuration".
Place the `credentials.json` file within the `cas_dam_admin/fileviwer/gcloud_interface/` directory.
This file is only necessary for the first run, after which, a token.pickle file will be generated to remember your credentials and login for subsequent use. 


#React Frontend

In order to kick off the React frontend app and have it display the spreadsheet/fileviewer, run the following commands. 
 
```
cd cas_dam_admin/frontend
npm install
npm start
```

This will open your browser to the React App site.

## Generating Static Files for Django

`cd cas_dam_admin/frontend`

`npm run build`

This process should have created a build folder within the current directory. 
Do not commit this build folder, it should already be in `.gitignore`. Any time changes are made 
to the React App, the `npm run build` command will have to be re-run in order to display them with Django. 

Now, start the Django server and check the url to view the site.

Note: If Google Cloud is disabled in the `setting.ini` file, switching to Google Cloud in the filebrowing modal will throw an error. 

#Known issues:

Browsing the filesystem doesn't work in Safari if the browser sends a sessionid cookie. Delete it in the Storage tab of
the developer's console to fix the problem
