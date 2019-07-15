curl -k -4 --silent  --cookie "JSESSIONID=D13E9C2BEBD32290956070A502768AE3" --url "localhost:8080/rest/collections/0fd17cb9-d5d9-4cce-8e2b-2bfa5256ea62/items"  -H "accept: application/json" -H "Content-Type: application/json" -d '
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
