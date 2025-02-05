#!/bin/bash
set -e

yarn build
sh ./backend/deploy-backend.sh