#!/usr/bin/env bash
docker run -d \
	--restart unless-stopped \
	-p 8000:8000 \
	-h `hostname` \
	--env DSPACE_URL=http://ibss-assets/rest \
	-v /home:/home \
	-v db.sqlite3:/cas_dam_admin/database/db.sqlite \
	--name dspace_uploader \
	joe_cas_dam_admin

