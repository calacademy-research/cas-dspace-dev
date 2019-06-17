#!/usr/bin/env bash
docker-compose -p d6 -f docker-compose.yml -f d6.override.yml down
