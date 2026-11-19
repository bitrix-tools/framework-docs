---
title: Создать объект кеша Application::getCache
description: Метод Application::getCache создает новый объект Cache с механизмом хранения из настроек.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getCache` создает новый объект [Cache](../data/cache/index.md). Секция `cache` файла `.settings.php` задает механизм хранения — файлы, Redis, Memcache или APCu.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getCache()
```

## Возвращаемое значение

Метод возвращает объект [Cache](../data/cache/index.md).

## Особенности

- Каждый вызов создает новый объект. Метод работает как [Cache::createInstance](../data/cache/create-instance.md).
- Один объект кеша хранит одну запись. Для другой записи создайте другой объект.

## Примеры

**Пример.** Код кеширует список единиц на час:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Application::getInstance()->getCache();

if ($cache->initCache(3600, 'units', '/vendor/units'))
{
    $units = $cache->getVars();
}
elseif ($cache->startDataCache())
{
    $units = ['kg', 'g', 't'];
    $cache->endDataCache($units);
}

echo implode(',', $units);
$cache->cleanDir('/vendor/units');
```

Код выведет `kg,g,t`.

## Смотрите также

- [Cache](../data/cache/index.md)
- [Кеширование](../../../performance/caching.md)
