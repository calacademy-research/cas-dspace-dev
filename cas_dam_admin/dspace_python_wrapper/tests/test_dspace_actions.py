import unittest
import configparser

from .. import Dspace

config = configparser.ConfigParser()
config.read('../settings.ini')
dspace_url = config['dSpace']['url']


API_URL = dspace_url


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)

    def test_test_rest_api(self):
        self.assertTrue(self.controller.test_rest_api())

    def test_login(self):
        self.controller.login('test@test.edu', 'test')
        self.assertGreater(len(self.controller.jsessionid), 0)


