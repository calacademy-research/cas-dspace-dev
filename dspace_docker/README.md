Hosted at http://localhost:8080/xmlui

Derived from https://github.com/DSpace-Labs/DSpace-Docker-Images

If you get 500 errors, it's probably a sequence problem. Run `docker exec -it dspacedb /bin/sh` and then run 
`/dspace-docker-tools/updateSequences.sh` to fix it.