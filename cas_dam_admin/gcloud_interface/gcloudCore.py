from __future__ import print_function
import pickle, io, os
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

class GoogleCore:

    tokenFile = 'token.pickle'
    credentialsFile = 'credentials.json'

    def __init__(self, authdir='./gcloudAuth/'):
        # Authdir is the location of the authentication files

        self.authdir = authdir
        self.service = self.authenticate()

    def authenticate(self):
        """ Authenticates Gdrive api and generates token.pickle file

        :return: gdrive service for making API calls
        """
        creds = None
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists(self.authdir + GoogleCore.tokenFile):
            with open(self.authdir + GoogleCore.tokenFile, 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.authdir + GoogleCore.credentialsFile, SCOPES)
                creds = flow.run_local_server()
            # Save the credentials for the next run
            with open(self.authdir + GoogleCore.tokenFile, 'wb') as token:
                pickle.dump(creds, token)

        service = build('drive', 'v3', credentials=creds)

        return service
