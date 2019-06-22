from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/drive']

class Gcloud:
    '''
    The gcloud functions are wrapped in a class to make it easier to interface with

    Files used for Authentication, stored in the authdir attribute

        tokenFile: pickle file used to remember login, if deleted, will prompt for login next time and rebuild file

        credentialsFile: json file that contains credentials that allow access to Google Drive API
    '''
    tokenFile = 'token.pickle'
    credentialsFile = 'credentials.json'

    def __init__(self, authdir=''):
        # Authdir is the location of the authentication files

        self.authdir = authdir
        self.service = self.authenticate()

    def authenticate(self):

        '''
        Authenticates google service and returns the service that can be used for all subsequent api calls
            Will build token.pickle file if not already built, remove this feature after testing.
        '''

        creds = None
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists(self.authdir + Gcloud.tokenFile):
            with open(self.authdir + Gcloud.tokenFile, 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.authdir + Gcloud.credentialsFile, SCOPES)
                creds = flow.run_local_server()
            # Save the credentials for the next run
            with open(self.authdir + Gcloud.tokenFile, 'wb') as token:
                pickle.dump(creds, token)

        service = build('drive', 'v3', credentials=creds)

        return service

    def perform_search(self, query, file_count):
        page_token = None

        print("Running search: "+query)

        while True:
            response = self.service.files().list(q=query,
                                                 spaces='drive',
                                                 fields='nextPageToken, files(id, name)',
                                                 pageToken=page_token).execute()
            files = []
            for file in response.get('files', []):
                # Process change
                files.append([file.get('name'), file.get('id')])

            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
        print("Successfully ran search: "+query)
        return files[:file_count]


    def children_search(self, folder_id, file_count=10):
        '''
        takes in the id of a folder in google drive and spits out (file_count) files

        folder_id is google drive id, referred to as driveId in API, which is a piece of metadata of each file
        '''
        query = "'%s' in parents" % folder_id
        return self.perform_search(query, file_count)


    def ID_from_name(self, file_name, file_count=10):
        '''
        takes in a file name and returns all files from google drive with that name

        returns string containing id if there is only one file with that name, otherwise it returns a list of the files which could be empty.
        '''

        query = "name = '%s'" % file_name
        results =  self.perform_search(query, file_count)

        if len(results) > 1:
            return results

        elif results == []:
            return []

        return results[0][1]

if __name__ == '__main__':
    import pprint
    '''
    Assumes token.pickle and credentials.json are in directory
    '''


    '''
    Sample Test prints 5 files from root directory of google drive
    '''
    g = Gcloud()
    files = g.children_search('root', 5)
    print("[File Name, File ID ]")
    print("")
    pprint.pprint(files)
