from dspace_python_wrapper import Dspace


if __name__ == "__main__":

    TEST_EMAIL = "test@test.edu"
    TEST_PASS = "admin"


    dspace = Dspace('http://localhost:8080/rest')
    dspace.login(TEST_EMAIL, TEST_PASS)

    TEST_EMAIL = 'test@test.edu'
    TEST_PASS = 'admin'

    def clear_test_data():

        def remove_item(item):
            dspace.delete_data_from_dspace('items', items[item])
            clear_test_data()

        items = dspace.get_data_from_dspace('items')

        if 'test' in items:
            remove_item('test')
        elif 'all in one test' in items:
            remove_item('all in one test')
        elif 'second line' in items:
            remove_item('second line')
        else:

            return

    clear_test_data()