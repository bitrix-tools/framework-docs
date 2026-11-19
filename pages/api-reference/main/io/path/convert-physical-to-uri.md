---
title: Перевести путь из кодировки файловой системы в URI Path::convertPhysicalToUri
description: Метод Path::convertPhysicalToUri переводит путь из кодировки файловой системы в UTF-8, кодирует его части для URL и убирает индексный файл.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertPhysicalToUri` переводит путь в кодировке файловой системы в URI. Метод работает как [convertLogicalToUri](convert-logical-to-uri.md), но перед кодированием частей переводит путь из кодировки файловой системы в UTF-8.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertPhysicalToUri($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь в кодировке файловой системы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает URI. Метод убирает индексный файл каталога в конце пути так же, как `convertLogicalToUri`, но до перевода кодировки. Если путь не в UTF-8, метод индексный файл не находит и не убирает.

## Примеры

**Пример.** Код переводит путь к файлу в URI:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Path::convertPhysicalToUri('/units/kg list.php');
```

Код выведет `/units/kg%20list.php`.

## Смотрите также

- [Path::convertLogicalToUri](convert-logical-to-uri.md)
- [Path::convertUriToPhysical](convert-uri-to-physical.md)
