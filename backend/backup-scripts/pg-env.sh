#!/bin/sh

# Находим имя контейнера PostgreSQL (без привязки к версии)
CONTAINER_NAME=$(docker ps --format "{{.Image}} {{.Names}}" | awk '$1 ~ /^postgres/ {print $2; exit}')

if [ -z "$CONTAINER_NAME" ]; then
  echo "❌ Ошибка: контейнер с PostgreSQL не найден!"
  exit 1
fi

echo "🔍 Найден контейнер PostgreSQL: $CONTAINER_NAME"

# Получаем переменные окружения из контейнера
DB_USER=$(docker exec "$CONTAINER_NAME" printenv POSTGRES_USER)
DB_PASSWORD=$(docker exec "$CONTAINER_NAME" printenv POSTGRES_PASSWORD)
DB_NAME=$(docker exec "$CONTAINER_NAME" printenv POSTGRES_DB)

if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
  echo "❌ Ошибка: не удалось получить параметры подключения из контейнера."
  exit 1
fi