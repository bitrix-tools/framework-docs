---
title: Создать объект кеша Cache::createInstance
description: Метод Cache::createInstance создает объект кеша с механизмом хранения из секции cache файла .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::createInstance` создает объект кеша. Метод получает механизм хранения из [createCacheEngine](create-cache-engine.md) по настройкам секции `cache` файла `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function createInstance($params = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| params | `array` | Задает параметры механизма хранения, метод передает их в конструктор механизма. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает новый объект того класса, у которого вызвали метод, например `Cache` или наследника. Каждый вызов создает новый объект, поэтому для каждого фрагмента кеша создавайте свой объект.

## Примеры

**Пример.** Код кеширует список единиц измерения на час:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();

if ($cache->initCache(3600, 'units_list', '/units'))
{
    $units = $cache->getVars();
}
elseif ($cache->startDataCache())
{
    $units = ['kg', 'g', 't'];
    $cache->endDataCache($units);
}

echo implode(',', $units);

$cache->clean('units_list', '/units');
```

Код выведет `kg,g,t`. Последняя строка удаляет кеш, чтобы пример не оставлял файлов.

## Смотрите также

- [Cache::initCache](init-cache.md)
- [Cache::createCacheEngine](create-cache-engine.md)
- [Кеширование](../../../../performance/caching.md)
