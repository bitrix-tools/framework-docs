---
title: Удалить кеш по ключу Cache::clean
description: Метод Cache::clean удаляет кеш с указанным ключом в каталоге.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::clean` удаляет один кеш по ключу и каталогу. Чтобы удалить весь кеш каталога, используйте [cleanDir](clean-dir.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function clean($uniqueString, $initDir = false, $baseDir = 'cache')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uniqueString\* | `string` | Задает ключ кеша, как в [initCache](init-cache.md) |
| initDir | `string` или `false` | Задает каталог кеша. По умолчанию — `false`. В отличие от `initCache`, метод не заменяет `false` каталогом `default`. Передайте тот же каталог, что в `initCache` |
| baseDir | `string` | Задает корневой каталог кеша. По умолчанию — `cache` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает результат механизма хранения. Файловый механизм ничего не возвращает, поэтому метод возвращает `null`.

## Примеры

**Пример.** Код удаляет кеш и проверяет, что его больше нет:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->startDataCache(3600, 'units_list', '/units');
$cache->endDataCache(['kg']);

$cache->clean('units_list', '/units');

var_dump(Cache::createInstance()->initCache(3600, 'units_list', '/units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [Cache::cleanDir](clean-dir.md)
- [Cache::initCache](init-cache.md)
