import requests
import json


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
        new_community_response = requests.post(self.rest_base_url + '/communities',
                                               cookies={'JSESSIONID': self.jsessionid},
                                               json=json_data,
                                               headers={"Accept": "application/json"})

        response_text = json.loads(new_community_response.text)

        return response_text['uuid']

    def create_new_community_from_data(self, community_name, short_description="", copyright_text=""):
        json_dict = {'name': community_name, 'shortDescription': short_description, 'copyrightText': copyright_text}

        json_data = json.loads(json_dict)

        new_community_response = requests.post(self.rest_base_url + '/communities',
                                               cookies={'JSESSIONID': self.jsessionid},
                                               json=json_data,
                                               headers={"Accept": "application/json"})

        response_text = json.loads(new_community_response.text)

        return response_text['uuid']

    def register_new_item_from_json(self, json_data, collection_uuid):
        """ Adds a new item to a collection

        :param json_data: json metadata of the item
        :param collection_uuid: the uuid of the collection
        :return: a tuple of the uuid and a dict of the response text
        :rtype: tuple(str, dict)
        """
        new_item_response = requests.post(self.rest_base_url + '/collections/' + collection_uuid + '/items',
                                          cookies={'JSESSIONID': self.jsessionid},
                                          headers={"Accept": "application/json"},
                                          json=json_data)

        new_item_response_text = json_data.loads(new_item_response.text)
        return new_item_response_text['uuid'], new_item_response_text

    def add_bitstream_to_item(self):
        pass

    def create_new_collection_from_json(self, community_uuid, json_data):
        ''' Adds a new collection to a community

        :param community_uuid: uuid of the community the data should be added to
        :param json_data: json metadata of the collection
        :return: the uuid of the new collection
        :rtype: tuple(str, dict)
        '''

        new_collection_response = requests.post(self.rest_base_url + '/communities/' + community_uuid + '/collections',
                                          cookies={'JSESSIONID': self.jsessionid},
                                          headers={"Accept": "application/json", "Content-Type": "application/json"},
                                          json=json_data)

        response_text = json.loads(new_collection_response.text)
        return response_text['uuid']

    def user_status(self):
        """ Gets the user's status, returns a tuple of authentication status and response text as a dict

        :rtype: tuple(bool, dict)
        """
        status_response = requests.get(self.rest_base_url + "/status",
                                       cookies={'JSESSIONID': self.jsessionid},
                                       headers={"Accept": "application/json"})

        status_response_text = json.loads(status_response.text)

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
