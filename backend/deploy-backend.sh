#!/bin/bash
set -e
cd "$(dirname "$0")" 

sudo docker-compose down
sudo docker-compose up --build -d
sudo docker image prune -a -f