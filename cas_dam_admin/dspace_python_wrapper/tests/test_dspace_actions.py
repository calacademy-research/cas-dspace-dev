import unittest

from .. import Dspace

API_URL = 'http://localhost:8080/rest'


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)

    def test_test_rest_api(self):
        self.assertTrue(self.controller.test_rest_api())

    def test_login(self):
        self.controller.login('test@test.edu', 'test')
        self.assertGreater(len(self.controller.jsessionid), 0)


