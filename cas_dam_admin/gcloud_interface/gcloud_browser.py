from .gcloud_core import GoogleCore

class GcloudBrowser(GoogleCore):

    def perform_search(self, query):
        """ Helper function that performs a generalized query on gdrive files

        :param query: str (Ex. ""'root' in parents" or "self.is_folder()")
        :return: file dictionaries from gdrive that matched query
        :rtype: list
        """
        page_token = None

        while True:
            response = self.service.files().list(q=query,
                                                 spaces='drive',
                                                 fields = '*',
                                                 pageToken=page_token).execute()
            files = []
            for file in response.get('files', []):
                files.append(file)
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break
        return files

    def children_search(self, folder_id, file_count=float('inf')):
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
        """returns id from file name

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

        :param filepath: str Ex. G:/root/photos/photo.jpeg
        :return: metadata of file from filepath
        :rtype: dict
        """

        """
        Currently breaks if the filename in the filepath has more than one file with that name
        Recursively go back in the path to determine if it is the correct file, until only one file remains
        """

        file_name = ''
        while True:
            if filepath[-1] == '/':
                break
            else:
                file_name = filepath[-1] + file_name
                filepath = filepath[:-1]

        file_id = self.ID_from_name(file_name)

        return self.get_metadata(file_id)