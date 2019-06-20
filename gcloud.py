from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
# SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
SCOPES = ['https://www.googleapis.com/auth/drive']

def main():
    """Shows basic usage of the Drive v3 API.
    Prints the names and ids of the first 10 files the user has access to.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server()
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)

    # Call the Drive v3 API
    # results = service.files().list(
    #     pageSize=10, fields="nextPageToken, files(id, name)").execute()
    # print(results)
    # items = results.get('files', [])
    # print(items)
    #
    # if not items:
    #     print('No files found.')
    # else:
    #     print('Files:')
    #     for item in items:
    #         print(u'{0}'.format(item['name']))
    def search_for_childrenW(folder_id):
        page_token = None
        query = "'root' in parents"
        print(query)
        while True:
            response = service.files().list(q= query,
                                                  spaces='drive',
                                                  fields='nextPageToken, files(id, name)',
                                                  pageToken=page_token).execute()
            for file in response.get('files', []):
                # Process change
                #print('Found file: %s (%s)' % (file.get('name'), file.get('id')))
                pass
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break

    """
    Format of the folder_id is weird. Ex. 'root' gives error but "'root'" works
    Also this function searches the entire tree ** big bad
    """
    def search_for_children(folder_id, depth=1):

        query = "%s in parents" % folder_id
        page_token = None
        while True:
            response = service.files().list(q= query,
                                                  spaces='drive',
                                                  fields='nextPageToken, files(id, name)',
                                                  pageToken=page_token).execute()
            for file in response.get('files', []):
                # Process change
                print('Found file: %s (%s)' % (file.get('name'), file.get('id')))
                pass
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
    search_for_children("'root'")

if __name__ == '__main__':
    main()
