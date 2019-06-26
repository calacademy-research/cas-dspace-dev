from __future__ import print_function
import pickle
import io
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import requests
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload


import pprint

SCOPES = ['https://www.googleapis.com/auth/drive']

class Gcloud:
    '''
    The gcloud functions are wrapped in a class to make it easier to interface with

    Files used for Authentication, stored in the authdir attribute,

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
        """ Authenticates Gdrive api and generates token.pickle file

        :return: gdrive service for making API calls
        """

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

    def perform_search(self, query):
        """ Helper function that performs a generalized query on gdrive files

        :param query: str (Ex. ""'root' in parents" or "self.is_foler()")
        :return: file dictionaries from gdrive that matched query
        :rtype: list
        """
        page_token = None

        #print("Running search: "+query)

        while True:
            response = self.service.files().list(q=query,
                                                 spaces='drive',
                                                 fields = '*',
                                                 pageToken=page_token).execute()
            files = []
            for file in response.get('files', []):
                # Process change
                #files.append([file.get('name'), file.get('id')])
                files.append(file)
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
        #print("Successfully ran search: "+query)
        return files


    def children_search(self, folder_id, file_count=10):
        """ Lists children of folder

        :param folder_id: str uuid of folder
        :param file_count: int
        :return: children of file
        :rtype: list
        """
        query = "'%s' in parents" % folder_id
        results = self.perform_search(query)

        if len(results) > file_count:
            results = results[:file_count]

        return results


    def ID_from_name(self, file_name, file_count=10):
        """
        returns id from file name

        if multiple files exist with that name --> returns all of the files
        if none exist with that name --> returns none of the files
        if one exists with that name --> returns uuid string

        :param file_name: str name of file
        :param file_count: int
        :return: uuid of file
        :rtype: str (or list if error)
        """

        query = "name = '%s'" % file_name
        results =  self.perform_search(query)

        if len(results) > file_count:
            results = results[:file_count]

        if len(results) > 1:
            return results

        elif results == []:
            return []

        return results[0]['id']

    def create_directory_tree(self, fileID, depth):
        """ Proof of concept creates directory tree of google drive

        :param fileID: str of top file
        :param depth: int of depth search
        :return: tree of files
        :rtype: list
        """

        if depth == 0:
            return []
        else:
            children = self.children_search(fileID, float('inf'))
            next_layer = []
            for child in children:
                if self.is_folder(child):
                    next_layer.append([child['name'], self.create_directory_tree(child['id'], depth - 1)])
                else:
                    next_layer.append([child['name']])
            return next_layer

    def is_folder(self, file_data):
        """ Checks if given file is a folder or not

        :param file_data: dict containing file metadata
        :return: whether or not file is folder
        :rtype: boolean
        """

        if file_data['mimeType'] == 'application/vnd.google-apps.folder':
            return True

        else:
            return False

    def get_metadata(self, fileID):
        """ Retrieves all metadata for given fileID

        :param fileID: str
        :return: metadata of given file
        :rtype: dict
        """

        metadata = self.service.files().get(fileId = fileID, fields = '*').execute()

        return metadata

    def get_filepath_from_file(self, file_data):
        """ Converts file_data into a gdrive filepath

        :param file_data: dict containing file metadata
        :return: filepath Ex. G:/root/photos/photo.jpeg
        :rtype: str
        """

        if 'parents' not in file_data or 'root' in file_data['parents']:
            return 'G:/root'
        else:
            parent = self.get_metadata(file_data['parents'][0])

            return self.get_filepath_from_file(parent) + '/' + str(file_data['name'])

    def get_file_from_filepath(self, filepath):
        """ Parses filepath to retrieve file

        :param file_path: str Ex. G:/root/photos/photo.jpeg
        :return: metadata of file from filepath
        :rtype: dict
        """

        file_name = ''
        while True:
            if filepath[-1] == '/':
                break
            else:
                file_name = filepath[-1] + file_name
                file_path = filepath[:-1]

        file_id = self.ID_from_name(file_name)

        return self.get_metadata(file_id)

    def download_file_to_directory(self, file_id, directory=''):
        """
        CURRENTLY THROWS AUTHENTICATION ERROR
        """


        """ Downloads file to a given directory

        :param file_id: str
        :param directory: str, directory on local machine
        :rtype: None
        """


        # request = self.service.files().get_media(fileId = file_id)
        # fh = io.BytesIO()
        # downloader = MediaIoBaseDownload(fh, request)
        # done = False
        # while not done:
        #     status, done = downloader.next_chunk()

        request = self.service.files().export_media(fileId=file_id,
                                                     mimeType='application/pdf')
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print("Download %d%%." % int(status.progress() * 100))

if __name__ == '__main__':
    """
    All Testing
    """

    import pprint

    def print_tree(tree, indent=''):
        """ prints tree given from create_directory_tree method

        :param tree: list tree
        :param indent: str counter of depth
        :return: nothing, only prints
        :rtype: None
        """

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

    #file_name = 'bigFilewithAll'
    #folder_id = g.ID_from_name(file_name)
    #pprint.pprint(g.get_metadata(folder_id))
    folder_id = '0B-mW0Jkbq82NeFhVT09UTVNSSVE'
    filepath = g.get_filepath_from_file(g.get_metadata(folder_id))
    file = g.get_file_from_filepath(filepath)
    #download_link = file['webContentLink']
    g.service = g.authenticate()
    g.download_file_to_directory(file['id'])



    # files = g.create_directory_tree(folder_id, 5)
    # print_tree(files)
