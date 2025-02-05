#!/bin/bash
set -e
cd "$(dirname "$0")" 

docker-compose down
docker-compose up --build
docker image prune -a -f