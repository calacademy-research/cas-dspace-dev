import unittest
import configparser

from .. import Dspace

config = configparser.ConfigParser()
config.read('settings.ini')
dspace_url = config['dSpace']['url']

API_URL = dspace_url


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)
        self.controller.login('test@test.edu', 'test')

    def test_user_status(self):
        self.assertTrue(self.controller.user_status()[0])
