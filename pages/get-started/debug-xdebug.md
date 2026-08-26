---
title: Отладка кода с помощью Xdebug
description: Настройка Xdebug в Docker-окружении и BitrixVM. Отладка кеширования, AJAX-экшенов, агентов и cron-скриптов в Bitrix Framework.
---

Xdebug — расширение PHP для пошаговой отладки. Оно позволяет остановить выполнение скрипта в нужной строке и посмотреть значения переменных в IDE без вызовов `echo` и `var_dump`.

Расширение Xdebug входит в состав официального [Docker-окружения](install-env.md#docker-images) и виртуальной машины BitrixVM. Для отладки включите расширение и настройте подключение к IDE.

{% note tip "" %}

Параметры, режимы работы и способы запуска отладки описаны в [документации Xdebug](https://xdebug.org/docs/).

{% endnote %}

{% note warning "" %}

Не оставляйте Xdebug включенным на сервере с рабочим сайтом. Расширение может снижать производительность PHP, даже когда отладка не запущена.

{% endnote %}

## Включить Xdebug в Docker-окружении

Расширение `xdebug` уже входит в состав образа `bitrix24/php`, но по умолчанию отключено.

Чтобы сохранить настройки при пересборке контейнера, задайте их в отдельном файле конфигурации и подключите файл к контейнеру как том `volume`.

1. Создайте в папке проекта файл `xdebug.ini`.

   ```ini
   zend_extension=xdebug.so

   xdebug.mode=debug
   xdebug.start_with_request=trigger
   xdebug.client_host=host.docker.internal
   xdebug.client_port=9003
   xdebug.idekey=PHPSTORM

   # ядро Bitrix Framework дает глубокий стек вызовов,
   # значения по умолчанию может не хватить
   xdebug.max_nesting_level=512
   ```

2. Создайте файл `docker-compose.override.yml` рядом с `docker-compose.yml` из репозитория `env-docker`.

   ```yaml
   services:
     php:
       volumes:
         - ./xdebug.ini:/usr/local/etc/php/conf.d/zz-xdebug.ini:ro
       extra_hosts:
         - "host.docker.internal:host-gateway"
   ```

3. Перезапустите контейнеры.

   ```bash
   docker compose up -d
   ```

4. Проверьте, что расширение подключилось.

   ```bash
   docker compose exec php php -v
   ```

   В выводе должна появиться строка с Xdebug.

5. В настройках IDE сопоставьте корень проекта на локальной машине с папкой сайта в контейнере — `/opt/www`.

{% note info "" %}

Директива `extra_hosts` нужна в Linux, где имя `host.docker.internal` не определяется автоматически. В macOS и Windows эту строку можно не указывать.

{% endnote %}

## Включить Xdebug в BitrixVM

В виртуальной машине расширение уже установлено. Файл его конфигурации находится в папке `/etc/php.d/` и по умолчанию отключен.

1. Подключитесь к машине по SSH под пользователем `root`.

2. Переименуйте файл конфигурации.

   ```bash
   mv /etc/php.d/xdebug.ini.disabled /etc/php.d/xdebug.ini
   ```

3. Приведите файл к виду, где `xdebug.client_host` — IP-адрес компьютера с IDE в той же сети, что и виртуальная машина.

   ```ini
   zend_extension=xdebug.so

   xdebug.mode=debug
   xdebug.start_with_request=trigger
   xdebug.client_host=192.168.1.10
   xdebug.client_port=9003
   xdebug.idekey=PHPSTORM

   # ядро Bitrix Framework дает глубокий стек вызовов,
   # значения по умолчанию может не хватить
   xdebug.max_nesting_level=512
   ```

4. Перезапустите PHP-FPM.

   ```bash
   /etc/init.d/php-fpm restart
   ```

5. В настройках IDE сопоставьте корень проекта на локальной машине с папкой сайта на виртуальной машине — `/home/bitrix/www`.

## Особенности отладки Bitrix Framework

### Кеширование

Если точка останова в компоненте не срабатывает, проверьте кеширование. Страница может загружаться из кеша без выполнения кода компонента.

- Отключите композитный кеш на время отладки. Он отдает страницу из статического файла, не доходя до PHP-кода компонента.

- Сбросьте кеш компонента или задайте параметр `CACHE_TIME` равным нулю.

- Проверьте кеш меню, инфоблоков и управляемый кеш. Они также могут возвращать готовый результат без выполнения кода компонента.

### AJAX-экшены

Запросы к контроллерам поступают на `/bitrix/services/main/ajax.php`. Триггер отладки из адресной строки для них не сработает. Используйте расширение для браузера, которое устанавливает cookie `XDEBUG_SESSION`. Браузер автоматически отправит cookie вместе с XHR-запросами.

### Агенты и cron-скрипты

Агенты, которые система запускает на хитах, отлаживайте как обычный запрос к сайту. Агенты, которые запускает cron, выполняются в CLI. В этом режиме нет cookie и GET-параметра, поэтому передайте триггер через переменную окружения.

```bash
# Docker-окружение
docker compose exec --user=bitrix -e XDEBUG_SESSION=PHPSTORM php \
  php -f /opt/www/bitrix/php_interface/cron_events.php
```

Для CLI-скриптов настройте в IDE отдельное сопоставление путей по тому же принципу, что и для веб-сервера.

### Долгие операции

Во время пошаговой отладки скрипт останавливается в заданной точке, а веб-сервер и IDE ожидают продолжения работы. Если отладка обрывается, увеличьте значения таймаутов `max_execution_time` в PHP и `fastcgi_read_timeout` в Nginx.
