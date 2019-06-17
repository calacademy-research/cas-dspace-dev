#!/usr/bin/env bash

start() {
  cd
  cd Documents/GitHub/cas-dspace-dev/dspace-docker/DSpace-Docker-Images/docker-compose-files/dspace-compose
  docker-compose -p d6 -f docker-compose.yml -f d6.override.yml up -d
  command
  cd
}

command() {
  docker exec -it dspace /bin/bash
}

stop() {
  cd
  cd Documents/GitHub/cas-dspace-dev/dspace-docker/DSpace-Docker-Images/docker-compose-files/dspace-compose
  docker-compose -p d6 -f docker-compose.yml -f d6.override.yml down
  cd
}
"$@"
