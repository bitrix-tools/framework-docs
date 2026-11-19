---
title: Пропустить чтение кеша на этом запросе Cache::setClearCache
description: Метод Cache::setClearCache задает флаг, по которому initCache не читает кеш на текущем запросе пользователя с правом управления кешем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::setClearCache` задает флаг пропуска чтения кеша на текущем запросе. Ядро вызывает метод, когда страницу открыли с параметром `clear_cache`. Флаг действует, только если у текущего пользователя есть право на операцию `cache_control`.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function setClearCache($clearCache)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| clearCache\* | `bool` | Задает флаг. Только `true` включает пропуск чтения кеша |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Флаг действует до конца запроса для всех объектов кеша. Метод [shouldClearCache](should-clear-cache.md) проверяет флаг.

## Примеры

**Пример.** Код включает флаг и проверяет его при запуске без авторизации:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Cache::setClearCache(true);

var_dump(Cache::shouldClearCache());

Cache::setClearCache(false);
```

Код выведет `bool(false)`. У гостя нет права `cache_control`.

## Смотрите также

- [Cache::shouldClearCache](should-clear-cache.md)
- [Cache::setClearCacheSession](set-clear-cache-session.md)
