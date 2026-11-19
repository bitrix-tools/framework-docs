---
title: Включить сбор статистики кеша Cache::setShowCacheStat
description: Метод Cache::setShowCacheStat включает запись операций с кешем в статистику CacheTracker для панели отладки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::setShowCacheStat` включает или выключает сбор статистики кеша. Когда сбор включен, объекты кеша записывают чтение, запись и удаление в класс `Bitrix\Main\Diag\CacheTracker`, а панель отладки показывает статистику.

Ядро вызывает метод в начале запроса по параметру `show_cache_stat=Y` или по одноименной cookie.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function setShowCacheStat($showCacheStat)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| showCacheStat\* | `bool` | Задает, собирать ли статистику |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Флаг действует до конца запроса для всех объектов кеша.

## Примеры

**Пример.** Код включает сбор статистики и проверяет флаг:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Cache::setShowCacheStat(true);

var_dump(Cache::getShowCacheStat());

Cache::setShowCacheStat(false);
```

Код выведет `bool(true)`.

## Смотрите также

- [Cache::getShowCacheStat](get-show-cache-stat.md)
