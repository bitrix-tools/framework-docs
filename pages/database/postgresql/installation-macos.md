---
title: Установка PostgreSQL на macOS
description: 'Установка PostgreSQL на macOS. Работа с базой данных в Bitrix Framework: установка, запуск сервиса и конфигурация PostgreSQL для миграции.'
---

PostgreSQL на macOS можно установить через Homebrew для локального окружения или тестового контура перед миграцией проекта с MySQL на PostgreSQL.

## Установка на macOS

Перед установкой проверьте, что Homebrew установлен и доступен в текущем терминале.

1. Установите PostgreSQL, например, 16 версии:

   ```bash
   brew install postgresql@16
   ```

   Homebrew создаст кластер базы данных с кодировкой UTF-8 в каталоге `$HOMEBREW_PREFIX/var/postgresql@16`.

2. Добавьте команды PostgreSQL в `PATH` для текущей сессии терминала:

   ```bash
   export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
   ```

   Чтобы команды `psql`, `createuser` и `createdb` были доступны после перезапуска терминала, добавьте эту строку в профиль вашей оболочки.

3. Запустите сервис:

   ```bash
   brew services start postgresql@16
   ```

   Команда запустит сервис и зарегистрирует его для автоматического запуска при входе пользователя в систему.

4. Проверьте, что сервис запущен:

   ```bash
   brew services list
   ```

## Конфигурация PostgreSQL

В примерах используется пользователь `www-data`, база данных `www-data` и пароль `passwd`. Замените эти значения на параметры вашего проекта.

1. Добавьте пользователя.

   ```bash
   createuser www-data
   ```

2. Добавьте базу данных.

   ```bash
   createdb www-data --owner www-data --encoding=UTF8
   ```

3. Разрешите пользователю создавать объекты в схеме `public`.

   ```bash
   psql -d www-data -c 'GRANT CREATE ON SCHEMA public TO "www-data";'
   ```

4. Добавьте расширение `pgcrypto`.

   ```bash
   psql -d www-data -c 'CREATE EXTENSION IF NOT EXISTS pgcrypto;'
   ```

5. Задайте пароль.

   ```bash
   psql postgres -c 'ALTER USER "www-data" WITH PASSWORD '\''passwd'\'';'
   ```

6. Проверьте подключение к базе данных.

   ```bash
   psql --username www-data --dbname www-data --host localhost
   ```

7. Если при соединении из PHP возникла ошибка `Ident authentication error...`, разрешите аутентификацию по паролю в файле `pg_hba.conf`. Чтобы найти файл, выполните:

   ```bash
   psql postgres -c 'SHOW hba_file;'
   ```

   В найденном файле замените метод аутентификации для локальных подключений на `password`.

   ```text
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            password
   # IPv6 local connections:
   host    all             all             ::1/128                 password
   ```

   После изменения конфигурации перезапустите сервис.

   ```bash
   brew services restart postgresql@16
   ```
