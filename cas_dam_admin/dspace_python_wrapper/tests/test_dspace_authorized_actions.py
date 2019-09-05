import unittest
from cas_dam_admin import settings

from .. import Dspace

dspace_url = settings.DSPACE_URL

API_URL = dspace_url


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)
        self.controller.login('test@test.edu', 'test')

    def test_user_status(self):
        self.assertTrue(self.controller.user_status()[0])
