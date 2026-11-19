---
title: Перенести настройки классического API Configuration::wnc
description: Метод Configuration::wnc вызывает мигратор настроек классического API. Мигратор дополняет общую конфигурацию и сохраняет ее в .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::wnc` вызывает мигратор настроек классического API. Мигратор дополняет общую конфигурацию и сохраняет ее в `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public static function wnc(): void;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Не возвращает значение.

## Особенности

Мигратор добавляет настройки только там, где `get` возвращает `null`. Он переносит параметры кеша и соединения из констант и глобальных переменных, задает настройки cookies и обработки ошибок. Секцию `connections` он создает с `readonly => true`. Если существует `/bitrix/php_interface/after_connect.php` и отсутствует `after_connect_d7.php`, он создает второй файл и заменяет вызовы `$DB->Query(` на `$this->queryExecute(`.

## Примеры

{% note warning "" %}

Метод меняет общую конфигурацию сайта. Перед запуском сохраните резервную копию файлов настроек. Пример предназначен для подготовленной тестовой установки с параметрами классического API.

{% endnote %}

**Пример.** Код вызывает мигратор после подготовки параметров классического API:

```php
<?php

use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Configuration::wnc();
```

## Смотрите также

- [Configuration::saveConfiguration](save-configuration.md)
- [Перенос настроек в конфигурационный файл](../../../../framework/settings.md#создать-конфигурационный-файл)
