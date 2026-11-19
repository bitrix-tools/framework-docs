---
title: Перевести путь в кодировку файловой системы Path::convertLogicalToPhysical
description: Метод Path::convertLogicalToPhysical переводит путь из UTF-8 в кодировку файловой системы, если они различаются.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertLogicalToPhysical` переводит путь из кодировки сайта UTF-8 в кодировку файловой системы. Вызывайте метод перед функциями PHP, которые работают с файлами, если в именах файлов есть нелатинские символы.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertLogicalToPhysical($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь в кодировке UTF-8 |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает путь в кодировке файловой системы. Если кодировки совпадают, метод возвращает путь без изменений.

## Особенности

Кодировку файловой системы задает константа `BX_FILE_SYSTEM_ENCODING`. Без константы метод считает кодировкой `windows-1251` в Windows и `utf-8` в остальных системах. Метод запоминает кодировки при первом вызове.

## Примеры

**Пример.** Код переводит путь с кириллицей в кодировку файловой системы и проверяет, есть ли файл:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$physicalPath = Path::convertLogicalToPhysical($_SERVER['DOCUMENT_ROOT'] . '/upload/единицы.txt');

echo file_exists($physicalPath) ? 'exists' : 'not found';
```

Если файла нет, код выведет `not found`.

## Смотрите также

- [Path::convertPhysicalToLogical](convert-physical-to-logical.md)
