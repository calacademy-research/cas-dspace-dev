#!/usr/bin/env bash
sudo docker run -d --restart unless-stopped -p 8000:8000 --env DSPACE_URL=http://ibss-assets/rest joe_cas_dam_admin