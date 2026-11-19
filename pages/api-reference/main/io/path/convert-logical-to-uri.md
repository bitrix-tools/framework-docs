---
title: Перевести путь в URI Path::convertLogicalToUri
description: Метод Path::convertLogicalToUri кодирует части пути для URL и убирает в конце индексный файл каталога, например index.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertLogicalToUri` переводит путь от корня сайта в URI. Метод кодирует каждую часть пути функцией `rawurlencode` и сохраняет косые черты.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertLogicalToUri($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь в кодировке UTF-8 |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает URI. Метод кодирует пробел как `%20`, кириллицу — байтами UTF-8, например `%D0%B5`.

## Особенности

Если имя файла — индексный файл каталога, метод убирает его и оставляет косую черту. Например, для `/units/index.php` метод вернет `/units/`. Список индексных файлов задает секция `directory_index` в конфигурации ядра. Ключи массива — имена файлов. Без секции метод берет `index.php`, `index.html`, `index.htm`, `index.phtml`, `default.html` и `index.php3`.

## Примеры

**Пример.** Код переводит в URI путь с пробелом и путь к индексному файлу:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Path::convertLogicalToUri('/upload/units list/kg.txt') . ' ' . Path::convertLogicalToUri('/units/index.php');
```

Код выведет `/upload/units%20list/kg.txt /units/`.

## Смотрите также

- [Path::convertPhysicalToUri](convert-physical-to-uri.md)
- [Path::convertUriToPhysical](convert-uri-to-physical.md)
