from django.test import SimpleTestCase
from rest_framework.test import APIClient


# Create your tests here.
class TestApiViews(SimpleTestCase):
    def setUp(self) -> None:
        self.client = APIClient()

    def test_valid_test_login_credentials(self):
        response = self.client.post('/api/test_login_credentials',
                          {'email': 'test@test.edu', 'password': 'test'},
                          format='json')
        self.assertEqual(response.status_code, 200)

    def test_invalid_test_login_credentials(self):
        response = self.client.post('/api/test_login_credentials',
                                    {'email': 'test@test.edu', 'password': 'incorrect password'},
                                    format='json')
        self.assertEqual(response.status_code, 403)
