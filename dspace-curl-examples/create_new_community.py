import requests
import json

login = requests.post('http://localhost:8080/rest/login',
                      data={'email': 'test@test.edu', 'password': 'test'})

jsessionid = login.cookies['JSESSIONID']

new_community = requests.post('http://localhost:8080/rest/communities',
                              cookies={'JSESSIONID': jsessionid},
                              json={"name": "test community"},
                              headers={"Accept": "application/json"})

response = json.loads(new_community.text)

uuid = response['uuid']
link = response['link']
