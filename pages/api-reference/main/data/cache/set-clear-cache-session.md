---
title: Пропустить чтение кеша до конца сессии Cache::setClearCacheSession
description: Метод Cache::setClearCacheSession задает флаг, по которому initCache не читает кеш до конца сессии пользователя с правом управления кешем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::setClearCacheSession` включает или выключает пропуск чтения кеша до конца сессии. Ядро вызывает метод, когда страницу открыли с параметром `clear_cache_session`. Сам метод не пишет флаг в сессию. Метод [shouldClearCache](should-clear-cache.md) записывает его в сессию ядра, только если у текущего пользователя есть право на операцию `cache_control`.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function setClearCacheSession($clearCacheSession)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| clearCacheSession\* | `bool` | Задает флаг. Значение `true` включает пропуск чтения кеша в сессии, другое значение выключает его |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает флаг и проверяет его при запуске без авторизации:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Cache::setClearCacheSession(true);

var_dump(Cache::shouldClearCache());
```

Код выведет `bool(false)`. У гостя нет права `cache_control`, поэтому флаг не попадает в сессию.

## Смотрите также

- [Cache::setClearCache](set-clear-cache.md)
- [Cache::shouldClearCache](should-clear-cache.md)
