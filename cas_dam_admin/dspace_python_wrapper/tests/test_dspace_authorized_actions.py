import unittest

from .. import Dspace

API_URL = 'http://localhost:8080/rest'


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)
        self.controller.login('test@test.edu', 'test')

    def test_user_status(self):
        self.assertTrue(self.controller.user_status()[0])


if __name__ == '__main__':
    unittest.main()
