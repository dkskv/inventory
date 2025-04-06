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

if [ -z "$DB_USER" ]; then
  echo "❌ Ошибка: не удалось получить имя пользователя из контейнера."
  exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Ошибка: не удалось получить пароль подключения из контейнера."
  exit 1
fi

if [ -z "$DB_NAME" ]; then
  echo "⚠️ Переменная POSTGRES_DB не найдена. Используем имя пользователя в качестве имени базы."
  DB_NAME="$DB_USER"
fi