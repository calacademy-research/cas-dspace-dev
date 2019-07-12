Hosted at http://localhost:8080/xmlui

Derived from https://github.com/DSpace-Labs/DSpace-Docker-Images

If you get 500 errors, it's probably a sequence problem. Run `docker exec -it dspacedb /bin/sh` and then run 
`/dspace-docker-tools/updateSequences.sh` to fix it.

Another source of 500 errors is not having the metadata schema of ibss-library installed.
Make sure that you have the ibss metadata imported into the dspace server.
`ibss-library.filebname` is the only one you need right now. Add it by going to the Metadata registry, visible on the
right side menu under the registries tab.

Add new schema with namespace and name ibss-library. Add them all if you wish, but the only one needed for the tests 
to run is filename.
```
133	ibss-library.commonName	                Common name of the species represented, if any
134	ibss-library.containerInformation	    Container information
135	ibss-library.familyName	                Family name of the species represented, if any
136	ibss-library.filename	                Filename(s) for searchability.
137	ibss-library.internalNotes	            Internal notes, for library use
138	ibss-library.physicalLocation	        Physical location
139	ibss-library.taxon	                    Taxon represented, if any
```