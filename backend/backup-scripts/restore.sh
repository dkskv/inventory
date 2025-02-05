#!/bin/sh

if [ -z "$1" ]; then
  echo "❌ Ошибка: укажите путь к backup-файлу на хосте!"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Ошибка: файл '$BACKUP_FILE' не найден!"
  exit 1
fi

# Подключаем файл с переменными
. "$(dirname "$0")/pg-env.sh"

echo "♻ Восстанавливаем базу '$DB_NAME' из backup-файла..."

cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" sh -c "PGPASSWORD=$DB_PASSWORD pg_restore --clean -U $DB_USER -d $DB_NAME"

if [ $? -eq 0 ]; then
  echo "✅ Восстановление успешно завершено!"
else
  echo "❌ Ошибка при восстановлении базы!"
  exit 1
fi