curl -k -4 --silent  --cookie "JSESSIONID=92CF8DB302C9F4E95AE9B17458AC3AB1" --url "localhost:8080/rest/collections/32a898bb-a2e3-46c0-8862-a7e4802791ba/items"  -H "accept: application/json" -H "Content-Type: application/json" -d '
{"metadata":[
    {
      "key": "dc.contributor.author",
      "value": "LAST, FIRST"
    },
    {
      "key": "dc.title",
      "language": "pt_BR",
      "value": "TESTE 8"
    }
]}
'

# -k: insecure, -4: use ipv4
# --cookie is the cookie given when logging in to dspace via /rest/login
# -H are the header sent to dspace (as far as I know) they are both needed]
# --url is the url to send the data to: in the format /rest/collections/{uuid of collection to be included in}/items
# -d data metadata needs to be in this format. ***MUST BE IN SINGLE QUOTES***
# last item in the list is the url to send the metadata to
# dspace will respond with the new item's UUID. This is needed for sending the binary data later
