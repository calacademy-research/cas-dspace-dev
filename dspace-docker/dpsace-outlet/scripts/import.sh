#!/usr/bin/env bash

run() {
  /dspace/bin/dspace import --add -eperson test@test.edu --collection $1 -s /outlet/to_import -m /outlet/mapfiles/mapfile"-"`date '+%Y-%m-%d-%H:%M:%S'`
}

delete() {
  /dspace/bin/dspace import -d -e test@test.edu -m /outlet/mapfiles/$1
  rm /mapfiles/$1
}
echo "Run it with ./scripts/import.sh [run/delete] [collection/mapfile]"
"$@"
