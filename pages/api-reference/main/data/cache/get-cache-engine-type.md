---
title: Получить тип механизма хранения Cache::getCacheEngineType
description: Метод Cache::getCacheEngineType возвращает короткое имя класса механизма хранения кеша в нижнем регистре.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::getCacheEngineType` возвращает тип механизма хранения кеша. Метод создает механизм методом [createCacheEngine](create-cache-engine.md) и берет имя его класса.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function getCacheEngineType()
```

## Возвращаемое значение

Метод возвращает имя класса без пространства имен в нижнем регистре, например `cacheenginefiles` или `cacheengineredis`. Если механизм недоступен, метод возвращает `cacheenginenone`.

## Примеры

**Пример.** Код проверяет, хранится ли кеш в файлах:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Cache::getCacheEngineType() === 'cacheenginefiles' ? 'files' : 'other';
```

При файловом кеше код выведет `files`.

## Смотрите также

- [Cache::createCacheEngine](create-cache-engine.md)
