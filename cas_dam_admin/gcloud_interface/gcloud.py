from __future__ import print_function
import io, os
from googleapiclient.http import MediaIoBaseDownload

from .gcloud_browser import GcloudBrowser
from .storage import TempStorage

"""
In Order to Refresh Scope During Testing,
stop dspace, then run Oauth. Otherwise token will not refresh.
This is possibly due to the Oauth and developement version of dspace running on the same ports
"""

TEST_EMAIL = 'test@test.edu'
TEST_PASS = 'admin'


class Gcloud(GcloudBrowser):

    def download_from_filepath(self, filepath):
        """Abstraction that downloads file from a given filepath.

        :param filepath: str Ex. G:/root/photos/photo.jpeg
        :return: Nothing
        :rtype: None
        """

        file = self.get_file_from_filepath(filepath)

        self.download_file_to_directory(file)

    def download_file(self, file_metadata):
        """Downloads a file to a temporary directory

        :param file_metadata: Google File Object
        :return: a TempStorage object that contains the download and ways to retrieve it.
        """
        t = TempStorage(file_metadata['name'])
        self.download_file_to_directory(file_metadata, t.path)

        return t

    def upload_to_dspace(self, google_file, metadata, collection_uuid):
        """Uploads a file to Dspace with the given metadata in the given collection


        :param google_file: Full Google File Object
        :param metadata: JSON Ex. {"dc.title": "test", "dc.contributor.author": "test author"}
        :param collection_uuid: string containing collection uuid
        :return: the response from the bitstream upload
        """
        storage_object = self.download_file(google_file)

        if not self.dspace.logged_in:
            self.dspace.login(TEST_EMAIL, TEST_PASS)
            print(self.dspace.logged_in)

        item_uuid, response = self.dspace.register_new_item_from_json(metadata, collection_uuid)

        bitstream_response = self.dspace.add_bitstream_to_item(storage_object.path+storage_object.file_name,
                                                               storage_object.file_name,
                                                               item_uuid)

        storage_object.remove_dir()

        return bitstream_response

    def download_file_to_directory(self, file_metadata, export_dir='', recursive=True):
        """ Downloads file to a given directory

        :param file_metadata: Google file object
        :param export_dir: location to drop off file
        :rtype: None
        """

        file_id = file_metadata['id']
        file_name = file_metadata['name']
        new_dir = export_dir + file_name

        if self.is_folder(file_metadata):
            if recursive:

                children = self.children_search(file_id)

                if not os.path.exists(new_dir):
                    os.makedirs(new_dir)

                for child in children:
                    self.download_file_to_directory(child, new_dir+'/', True)
            else:
                return "Download request was run with a folder, but was not recursive"
        else:
            request = self.service.files().get_media(fileId=file_id)

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

    TEST_EMAIL = 'test@test.edu'
    TEST_PASS = 'admin'

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
    test_data = {"dc.title": "test", "dc.contributor.author": "test author"}
    test_collection_uuid = '5d228494-34cb-458f-af16-5f29654f5c68'

    file_name = 'santa-koala-christmas-illustration-cartoon-bear-s-hat-glass-bowl-46924918.jpg'
    folder_id = g.ID_from_name(file_name)
    file = g.get_metadata(folder_id)
