import unittest

from .. import Dspace

API_URL = 'http://localhost:8080/rest'


class TestDspaceController(unittest.TestCase):
    def setUp(self):
        self.controller = Dspace(API_URL)
        self.controller.login('test@test.edu', 'test')
        self.community_uuid = self.controller.create_new_community_from_data('unittest collection')
        self.collection_uuid = self.controller.create_new_collection_from_json(self.community_uuid,
                                                                               '{"name": "test community"}')

    def test_registering_new_item(self):
        new_item_uuid, response = self.controller.register_new_item_from_json(
            {"dc.title": "test", "dc.contributor.author": "test author"}, self.collection_uuid)
        self.assertEqual(len(new_item_uuid), 36)
        deleted_item_response = self.controller.delete_item(new_item_uuid)
        self.assertTrue(deleted_item_response)
        self.assertFalse(self.controller.does_item_exist(new_item_uuid))


    def tearDown(self) -> None:
        self.controller.delete_community(self.community_uuid)


if __name__ == '__main__':
    unittest.main()
