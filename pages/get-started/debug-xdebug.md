---
title: Отладка кода с помощью Xdebug
description: Включение Xdebug в Docker-окружении и BitrixVM. Особенности отладки Bitrix Framework: кеширование, AJAX-экшены, агенты и cron-скрипты.
---

Xdebug — расширение PHP для пошаговой отладки. Вместо того чтобы расставлять по коду `echo` и `var_dump`, вы останавливаете выполнение скрипта в нужной строке и смотрите значения всех переменных прямо в IDE.

Расширение входит в состав официального [Docker-окружения](install-env.md#docker-obrazy) и виртуальной машины BitrixVM — его нужно только включить и связать с IDE.

{% note tip "" %}

Описание всех параметров, режимов работы и способов запуска отладки — в [документации Xdebug](https://xdebug.org/docs/).

{% endnote %}

{% note warning "" %}

Не оставляйте Xdebug включенным на боевом сервере. Расширение существенно замедляет каждый хит, даже когда отладка не запущена.

{% endnote %}

## Включение Xdebug в Docker-окружении

Расширение `xdebug` уже входит в состав образа `bitrix24/php`, но по умолчанию отключено.

Чтобы настройки не терялись при пересборке контейнера, задайте их в отдельном ini-файле и подключите его как volume.

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

Директива `extra_hosts` нужна в Linux, где имя `host.docker.internal` не резолвится автоматически. В macOS и Windows строку можно не указывать.

{% endnote %}

## Включение Xdebug в BitrixVM

В виртуальной машине расширение уже установлено, а его конфигурация лежит в папке `/etc/php.d/`. Файл поставляется отключенным.

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

Если точка останова в компоненте не срабатывает, скорее всего, страница отдается из кеша и ваш код просто не выполняется.

- Отключите композитный кеш на время отладки. Он отдает страницу из статического файла, не доходя до PHP-кода компонента.

- Сбросьте кеш компонента или задайте параметр `CACHE_TIME` равным нулю.

- Помните про кеш меню, инфоблоков и управляемый кеш — они также могут возвращать готовый результат без вызова вашего кода.

### AJAX-экшены

Запросы к контроллерам идут на `/bitrix/services/main/ajax.php`. Триггер отладки в адресной строке для них не сработает — используйте расширение для браузера, которое ставит cookie `XDEBUG_SESSION`: она отправляется вместе с XHR-запросами автоматически.

### Агенты и cron-скрипты

Агенты, запускаемые на хитах, отлаживаются как обычный запрос к сайту. Агенты на cron выполняются в CLI, где ни cookie, ни GET-параметра нет — триггер передается через переменную окружения.

```bash
# Docker-окружение
docker compose exec --user=bitrix -e XDEBUG_SESSION=PHPSTORM php \
  php -f /opt/www/bitrix/php_interface/cron_events.php
```

Для CLI-скриптов в IDE нужно отдельное сопоставление путей — такое же, как для веб-сервера.

### Долгие операции

При пошаговой отладке скрипт стоит на точке останова, а веб-сервер и IDE ждут. Если отладка обрывается, увеличьте таймауты: `max_execution_time` в PHP и `fastcgi_read_timeout` в Nginx.