Initial commit for project

#Getting started:

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

In order to kick off the React frontend app and have it display the fileviewer, run the following commands. 
 
`cd cas_dam_admin/fileviewer-frontend`  
`npm install`  
`npm run build`  

This process should have created a build file within the current directory. 
Do not commit this build file, it should already be in `.gitignore`. Any time changes are made 
to the React App, the `npm run build` command will have to be re-run. Now, start the Django server and check the `/fileviewer/react` url for the file browsing React App. 
If Google Cloud is disabled in the `setting.ini` file, switching to Google Cloud will throw an error. 

this lives at /fileviewer/react/

#Third Party code
We're currently using Cory S.N. LaViska's jQuery file browser plugin (https://www.abeautifulsite.net/jquery-file-tree)
to manage browsing paths on slevin. (MIT License)

We are also using Lea Verou http://lea.verou.me's Stretchy.js to handle flexible text box sizes, using an MIT License

#Known issues:

Browsing the filesystem doesn't work in Safari if the browser sends a sessionid cookie. Delete it in the Storage tab of
the developer's console to fix the problem
