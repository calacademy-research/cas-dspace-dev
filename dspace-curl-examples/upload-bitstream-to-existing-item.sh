curl -k -4 \
  --cookie "JSESSIONID=92CF8DB302C9F4E95AE9B17458AC3AB1" \
  -H "accept: application/json" \
	-X POST --url "localhost:8080/rest/items/b451f94e-2ac6-4807-a121-868e42828ef0/bitstreams?name=test.pdf" \
  -T "./file.pdf"

# -k insecure, -4 ipv4, cookie same as always
# -H accept header, even when we don't need it. 
