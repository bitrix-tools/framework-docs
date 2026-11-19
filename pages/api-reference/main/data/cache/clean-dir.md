---
title: Удалить кеш каталога Cache::cleanDir
description: Метод Cache::cleanDir удаляет весь кеш каталога, в том числе вложенных каталогов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::cleanDir` удаляет весь кеш каталога, в том числе вложенных каталогов. Метод нужен после изменения данных, от которых зависит кеш, например после добавления записи.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function cleanDir($initDir = false, $baseDir = 'cache')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| initDir | `string` или `false` | Задает каталог кеша, например `/units`. По умолчанию — `false` |
| baseDir | `string` | Задает корневой каталог кеша. По умолчанию — `cache` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Без каталога, то есть с `false` или пустой строкой, метод удаляет весь кеш в `baseDir`. Не вызывайте метод без аргумента, если нужно удалить кеш одного раздела.
- Файловый механизм удаляет каталог отложенно. Метод переименовывает каталог в `<каталог>.~<число>`, а ядро удаляет его позже. Метод [initCache](init-cache.md) сразу перестает находить кеш.

## Примеры

**Пример.** Код удаляет весь кеш каталога `/units` после изменения данных:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->startDataCache(3600, 'units_list', '/units');
$cache->endDataCache(['kg']);

Cache::createInstance()->cleanDir('/units');

var_dump(Cache::createInstance()->initCache(3600, 'units_list', '/units'));
```

Код выведет `bool(false)`.

## Смотрите также

- [Cache::clean](clean.md)
- [Кеширование](../../../../performance/caching.md)
