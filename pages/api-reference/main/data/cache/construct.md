---
title: Создать объект кеша с механизмом хранения Cache::__construct
description: Конструктор Cache создает объект кеша с переданным механизмом хранения CacheEngineInterface.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Cache::__construct` создает объект кеша с переданным механизмом хранения. Конструктор нужен, когда механизм хранения отличается от настроек сайта, например в тестах. В остальных случаях используйте [createInstance](create-instance.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function __construct($cacheEngine)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| cacheEngine\* | `Bitrix\Main\Data\CacheEngineInterface` | Задает механизм хранения, например `CacheEngineFiles` или `CacheEngineNone` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\TypeError` | Аргумент не реализует `CacheEngineInterface`. Свойство объекта типизировано, поэтому PHP не принимает другое значение |

## Примеры

**Пример.** Код создает кеш без хранения — объект с механизмом `CacheEngineNone` никогда не находит кеш:

```php
<?php
use Bitrix\Main\Data\Cache;
use Bitrix\Main\Data\CacheEngineNone;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = new Cache(new CacheEngineNone());
$cache->initCache(3600, 'units_list', '/units');
$cache->startDataCache();
$cache->endDataCache(['kg']);

var_dump($cache->initCache(3600, 'units_list', '/units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [Cache::createInstance](create-instance.md)
- [Cache::createCacheEngine](create-cache-engine.md)
