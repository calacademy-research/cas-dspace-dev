from __future__ import print_function
import io, os
from googleapiclient.http import MediaIoBaseDownload

from gcloud_interface.gcloudBrowser import GcloudBrowser
from gcloud_interface.storage import TempStorage

"""
In Order to Refresh Scope During Testing,
stop dspace, then run Oauth. Otherwise token will not refresh.
This is possibly due to the Oauth and developement version of dspace running on the same ports
"""


class Gcloud(GcloudBrowser):
    '''
    The gcloud functions are wrapped in a class to make it easier to interface with

    Files used for Authentication, stored in the authdir attribute,

        tokenFile: pickle file used to remember login, if deleted, will prompt for login next time and rebuild file

        credentialsFile: json file that contains credentials that allow access to Google Drive API
    '''


    def download_from_filepath(self, filepath):
        """Abstraction that downloads file from a given filepath.

        :param filepath: str Ex. G:/root/photos/photo.jpeg
        :return: Nothing
        :rtype: None
        """

        file = self.get_file_from_filepath(filepath)

        self.download_file_to_directory(file)

    def download_file(self, file):
        t = TempStorage()
        self.download_file_to_directory(file, t.path)
        files = t.contents()
        t.remove_dir()
        return files


    def download_file_to_directory(self, file, exportDir='', recursive=True):
        """ Downloads file to a given directory

        :param file_id: str
        :param directory: str, directory on local machine
        :rtype: None
        """
        #print(file)

        file_id = file['id']
        file_name = file['name']
        new_dir = exportDir +file_name

        if self.is_folder(file):
            if recursive:

                children = self.children_search(file_id)

                if not os.path.exists(new_dir):
                    os.makedirs(new_dir)

                for child in children:
                    self.download_file_to_directory(child, new_dir+'/', True)
            else:
                return "Download request was run with a folder, but was not recursive"
        else:
            request = self.service.files().get_media(fileId = file_id)

            fh = io.FileIO(new_dir, 'wb')
            downloader = MediaIoBaseDownload(fh, request)

            done = False
            while not done:
                status, done = downloader.next_chunk()

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

    file_name = 'Microscope Photos'
    folder_id = g.ID_from_name(file_name)
    file = g.get_metadata(folder_id)

    print(g.download_file(file))
