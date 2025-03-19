#!/bin/bash
set -e

sh ./git-refresh.sh

echo "Installing dependencies in the root directory..."
yarn install

echo "Installing dependencies in the /backend directory..."
cd backend
yarn install
cd ..

echo "Installing dependencies in the /frontend directory..."
cd frontend
yarn install
cd ..

yarn build
sh ./backend/deploy-backend.sh