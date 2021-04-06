#!/usr/bin/env bash
docker run -d --restart unless-stopped -p 8000:8000 --env DSPACE_URL=http://ibss-assets/rest -v /home:/home --name dspace_uploader joe_cas_dam_admin

