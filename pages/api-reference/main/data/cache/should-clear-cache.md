---
title: Проверить, нужно ли пропустить чтение кеша Cache::shouldClearCache
description: Метод Cache::shouldClearCache проверяет, попросил ли пользователь с правом управления кешем пропустить чтение кеша на этом запросе или в сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.2

{% endnote %}

Метод `Cache::shouldClearCache` проверяет, нужно ли пропустить чтение кеша. Метод [initCache](init-cache.md) вызывает его и при `true` не читает кеш, поэтому код формирует данные заново и перезаписывает кеш.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function shouldClearCache()
```

## Возвращаемое значение

Метод возвращает `true` в двух случаях.

- Пользователь с правом на операцию `cache_control` открыл страницу с параметром `clear_cache=Y`, и ядро вызвало [setClearCache](set-clear-cache.md).
- Пользователь с правом `cache_control` открыл страницу с параметром `clear_cache_session=Y`, и ядро вызвало [setClearCacheSession](set-clear-cache-session.md). Метод проверяет флаг сессии только после запуска пролога.

В остальных случаях метод возвращает `false`, в том числе до инициализации приложения.

## Особенности

Метод сохраняет флаг пропуска в сессию ядра при каждом вызове, если [setClearCacheSession](set-clear-cache-session.md) задал значение, а у пользователя есть право `cache_control`.

## Примеры

**Пример.** Код проверяет флаг при запуске без авторизации:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Cache::shouldClearCache());
```

Код выведет `bool(false)`.

## Смотрите также

- [Cache::setClearCache](set-clear-cache.md)
- [Cache::setClearCacheSession](set-clear-cache-session.md)
