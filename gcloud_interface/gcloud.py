from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

import pprint

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
                                                 #fields='nextPageToken, files(id, name)',
                                                 pageToken=page_token).execute()
            files = []
            for file in response.get('files', []):
                # Process change
                #files.append([file.get('name'), file.get('id')])
                files.append(file)
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
        print("Successfully ran search: "+query)
        return files


    def children_search(self, folder_id, file_count=10000):
        '''
        takes in the id of a folder in google drive and spits out (file_count) files

        folder_id is google drive id, referred to as driveId in API, which is a piece of metadata of each file
        '''
        query = "'%s' in parents" % folder_id
        results =  self.perform_search(query, file_count)
        return results
        #return [[file.get('name'), file.get('id')] for file in results]


    def ID_from_name(self, file_name, file_count=10):
        '''
        takes in a file name and returns all files from google drive with that name

        returns string containing id if there is only one file with that name, otherwise it returns a list of the files which could be empty.
        '''

        query = "name = '%s'" % file_name
        results =  self.perform_search(query, file_count)
        #id_name_tuples  = [(file.get('name'), file.get('id')) for file in results]

        if len(results) > 1:
            return results

        elif results == []:
            return []

        return results[0]['id']

    def create_directory_tree(self, fileID, depth):
        if depth == 0:
            return []
        else:
            children = self.children_search(fileID)
            next_layer = []
            for child in children:
                if self.is_folder(child):
                    next_layer.append([child['name'], self.create_directory_tree(child['id'], depth - 1)])
                else:
                    next_layer.append([child['name']])
            return next_layer

            #return [[child['name'], create_directory_tree(self.children_search(child['id']), depth - 1)] if self.is_folder(child) else [child['name']] for child in children]



    def is_folder(self, file_data):
        if file_data['mimeType'] == 'application/vnd.google-apps.folder':
            return True

        else:
            return False

if __name__ == '__main__':

    def print_tree(tree, indent=''):
        for branch in tree:
            if type(branch) == list and branch != []:
                print_tree(branch, indent+ '     ')
            else:
                if branch != []:
                    print(indent+ str(branch))

    '''
    Assumes token.pickle and credentials.json are in directory
    '''


    '''
    Sample Test prints out a tree of everything within that folder of the google drive
    '''
    g = Gcloud()
    file_name = 'bigFilewithAll'
    folder_id = g.ID_from_name(file_name)
    files = g.create_directory_tree(folder_id, 3)
    print(files)
    print_tree(files)
