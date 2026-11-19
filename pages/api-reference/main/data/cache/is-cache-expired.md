---
title: Проверить, истек ли кеш Cache::isCacheExpired
description: Метод Cache::isCacheExpired проверяет по пути к файлу, истек ли кеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::isCacheExpired` проверяет, истек ли кеш, по пути к его файлу. Метод передает путь механизму хранения. Для проверки кеша по ключу используйте [initCache](init-cache.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function isCacheExpired($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает абсолютный путь к файлу кеша |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если кеш истек или файла нет, и `false`, если кеш действует. Формат пути зависит от механизма хранения. Пример ниже рассчитан на файловый механизм.

## Примеры

**Пример.** Код проверяет файл кеша, которого нет:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = $_SERVER['DOCUMENT_ROOT'] . '/bitrix/cache/units/' . Cache::getPath('units_missing');

var_dump(Cache::createInstance()->isCacheExpired($path));
```

Код выведет `bool(true)`.

## Смотрите также

- [Cache::getPath](get-path.md)
- [Cache::initCache](init-cache.md)
