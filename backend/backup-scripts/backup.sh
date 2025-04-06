#!/bin/sh

# Подключаем файл с переменными
. "$(dirname "$0")/pg-env.sh"

BACKUP_DIR="/var/db-backups"
TIMESTAMP=$(date +"%Y%m%d%H%M")
BACKUP_FILE="$BACKUP_DIR/backup-${DB_NAME}-$TIMESTAMP.dump"

# Создаем папку, если её нет
docker exec "$CONTAINER_NAME" mkdir -p "$BACKUP_DIR"

docker exec "$CONTAINER_NAME" \
  env PGPASSWORD="$DB_PASSWORD" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Бэкап успешно сохранен в контейнере: $BACKUP_FILE"
else
  echo "❌ Ошибка при создании бэкапа!"
  exit 1
fi
