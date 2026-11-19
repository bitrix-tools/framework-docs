---
title: Отменить запись кеша Cache::abortDataCache
description: Метод Cache::abortDataCache отменяет запись кеша, которую начал startDataCache, и выводит накопленный HTML.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::abortDataCache` отменяет запись кеша, которую начал [startDataCache](start-data-cache.md). Метод нужен, когда код не получил данные и сохранять их в кеш нельзя, например при ошибке или пустом результате.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function abortDataCache()
```

## Возвращаемое значение

Метод ничего не возвращает. Метод выводит HTML, накопленный в буфере, и не сохраняет кеш. Если `startDataCache` не начал запись, метод ничего не делает.

## Примеры

**Пример.** Код не сохраняет кеш, если данных нет:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();

if ($cache->startDataCache(3600, 'units_empty', '/units'))
{
    $units = [];

    if (empty($units))
    {
        $cache->abortDataCache();
    }
    else
    {
        $cache->endDataCache($units);
    }
}

var_dump(Cache::createInstance()->initCache(3600, 'units_empty', '/units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [Cache::startDataCache](start-data-cache.md)
- [Cache::endDataCache](end-data-cache.md)
