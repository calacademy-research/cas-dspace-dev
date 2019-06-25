import json

import requests


class Dspace:
    def __init__(self, rest_base_url):

        # Testing Url: http://localhost:8080/rest
        self.rest_base_url = rest_base_url
        self.jsessionid = ""

    def login(self, email, password):
        """ Logs into the dSpace instance

        :type email: str
        :type password: str
        """
        data = {'email': email, 'password': password}
        login_response = requests.post(self.rest_base_url + "/login", data=data)

        self.jsessionid = login_response.cookies['JSESSIONID']

    def create_new_community_from_json(self, json_data):
        """
        Creates a new community from json metadata
        :param json_data: str
        :return: uuid of the new community
        :rtype: str
        """
        new_community_response = requests.post(self.rest_base_url + '/communities',
                                               cookies={'JSESSIONID': self.jsessionid},
                                               json=json_data,
                                               headers={"Accept": "application/json"})

        response_text = new_community_response.json()

        return response_text['uuid']

    def create_new_community_from_data(self, community_name, short_description="", copyright_text=""):
        """
        Creates a new community from parameters
        :param community_name: name of the new community
        :param short_description: a short description of the new community
        :param copyright_text: copyright text for the new community
        :return: uuid of the new community
        ":rtype: str
        """
        json_data = {'name': community_name, 'shortDescription': short_description, 'copyrightText': copyright_text}

        new_community_response = requests.post(self.rest_base_url + '/communities',
                                               cookies={'JSESSIONID': self.jsessionid},
                                               json=json_data,
                                               headers={"Accept": "application/json"})

        response_text = new_community_response.json()

        return response_text['uuid']

    def register_new_item_from_json(self, json_data, collection_uuid):
        """ Adds a new item to a collection

        :param json_data: json metadata of the item
        :param collection_uuid: the uuid of the collection
        :type json_data: dict
        :return: a tuple of the uuid and a dict of the response text
        :rtype: tuple(str, dict)
        """

        json_metadata = {'metadata': []}

        for key, value in json_data.items():
            if key == "filename":   # filename should not be imported into dSpace, but library.filename should
                continue
            json_metadata['metadata'].append({'key': key, 'value': value})

        new_item_response = requests.post(self.rest_base_url + '/collections/' + collection_uuid + '/items',
                                          cookies={'JSESSIONID': self.jsessionid},
                                          headers={"Accept": "application/json"},
                                          json=json_metadata)

        new_item_response_text = new_item_response.json()
        return new_item_response_text['uuid'], new_item_response_text

    def add_bitstream_to_item(self, filepath, filename, uuid):
        """ Adds a bitstream to an existing item

        :param filepath: complete path to the file, with the filename on the end
        :param filename: only the name of the file
        :param uuid: uuid of the item to add the bitstream to
        :type filepath: str
        :type filename: str
        :type uuid: str
        :return: the response as a dict
        :rtype: dict
        """
        files = {'file': open(filepath, 'rb')}
        bitstream_response = requests.post(self.rest_base_url + '/items/' + uuid + '/bitstreams',
                                           cookies={'JSESSIONID': self.jsessionid},
                                           headers={"Accept": "application/json",
                                                    "Content-Type": "multipart/form-data"},
                                           data=files['file'],
                                           params={'name': filename})

        return bitstream_response.json()

    def create_new_collection_from_json(self, community_uuid, json_data):
        """Adds a new collection to a community

        :param community_uuid: uuid of the community the data should be added to
        :param json_data: json metadata of the collection
        :type community_uuid: str
        :type json_data: str
        :return: the uuid of the new collection
        :rtype: str
        """
        json_data = json.loads(json_data)
        new_collection_response = requests.post(self.rest_base_url + '/communities/' + community_uuid + '/collections',
                                                cookies={'JSESSIONID': self.jsessionid},
                                                headers={"Accept": "application/json",
                                                         "Content-Type": "application/json"},
                                                json=json_data)

        response_text = new_collection_response.json()
        return response_text['uuid']

    def user_status(self):
        """ Gets the user's status, returns a tuple of authentication status and response text as a dict

        :rtype: tuple(bool, dict)
        """
        status_response = requests.get(self.rest_base_url + "/status",
                                       cookies={'JSESSIONID': self.jsessionid},
                                       headers={"Accept": "application/json"})

        status_response_text = status_response.json()

        if status_response_text['authenticated']:
            return True, status_response_text
        else:
            return False, status_response_text

    def test_rest_api(self):
        """ Tests if the api is running


        :return: True if the api is running, False otherwise
        :rtype: bool
        """
        test_response = requests.get(self.rest_base_url + "/test")

        if test_response.text == "REST api is running.":
            return True
        return False

    def get_data_from_dspace(self, datatype):
        """ Retrieves objects from dspace.

        :param datatype: a type of object to retrieve (items, collections, communities, bitstreams).
        :return: dictionary {'name' : 'id'}

        """

        if not datatype in ["items", "collections", "communities", "bitstreams"]:
            return False

        search = requests.get(self.rest_base_url + "/" + datatype,
                              headers={"Accept": "application/json"})
        search_list = json.loads(search.text)

        content_dict = {}

        for item in search_list:
            content_dict[item['name']] = item['uuid']

        return content_dict

    def delete_community(self, community_uuid):
        delete_response = requests.delete(self.rest_base_url + '/communities/' + community_uuid,
                                          cookies={'JSESSIONID': self.jsessionid},
                                          headers={"Accept": "application/json"})

        return delete_response.ok

    def delete_item(self, item_uuid):
        delete_response = requests.delete(self.rest_base_url + '/items/' + item_uuid,
                                          cookies={'JSESSIONID': self.jsessionid},
                                          headers={"Accept": "application/json"})

        return delete_response.ok

    def does_item_exist(self, item_uuid):
        search_response = requests.get(self.rest_base_url + '/items/' + item_uuid,
                                       headers={"Accept": "application/json"})
        if search_response.status_code == 200:
            return True
        elif search_response.status_code == 404:
            return False
        else:
            raise Exception
