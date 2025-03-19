git fetch --depth 1 origin $(git rev-parse --abbrev-ref HEAD)
git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
git reflog expire --all --expire=now
git gc --prune=now