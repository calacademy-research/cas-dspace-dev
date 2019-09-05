import unittest
from cas_dam_admin import settings

from .. import Dspace

dspace_url = settings.DSPACE_URL


API_URL = dspace_url


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)

    def test_test_rest_api(self):
        self.assertTrue(self.controller.test_rest_api())

    def test_login(self):
        self.controller.login('test@test.edu', 'test')
        self.assertGreater(len(self.controller.jsessionid), 0)


