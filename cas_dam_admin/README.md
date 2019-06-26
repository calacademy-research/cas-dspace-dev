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

#Third Party code
We're currently using Cory S.N. LaViska's jQuery file browser plugin (https://www.abeautifulsite.net/jquery-file-tree)
to manage browsing paths on slevin. (MIT License)

We are also using Lea Verou http://lea.verou.me's Stretchy.js to handle flexible text box sizes, using an MIT License

#Known issues:

Browsing the filesystem doesn't work in Safari if the browser sends a sessionid cookie. Delete it in the Storage tab of
the developer's console to fix the problem
