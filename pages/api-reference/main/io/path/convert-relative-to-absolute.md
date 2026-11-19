---
title: Перевести путь от корня сайта в абсолютный путь Path::convertRelativeToAbsolute
description: Метод Path::convertRelativeToAbsolute соединяет корень сайта из $_SERVER['DOCUMENT_ROOT'] с путем и нормализует результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertRelativeToAbsolute` переводит путь от корня сайта в абсолютный путь на сервере. Метод соединяет `$_SERVER['DOCUMENT_ROOT']` с путем методом [combine](combine.md).

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertRelativeToAbsolute($relativePath)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| relativePath\* | `string` | Задает путь от корня сайта, например `/upload/units` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает нормализованный абсолютный путь. Метод не проверяет, существует ли файл.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Путь — не строка |
| `Bitrix\Main\ArgumentNullException` | Путь — пустая строка |
| `Bitrix\Main\IO\InvalidPathException` | Путь содержит нулевой байт или частей `..` больше, чем частей перед ними |

## Примеры

**Пример.** Код получает абсолютный путь к каталогу в `/upload/`:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Path::convertRelativeToAbsolute('/upload/units');
```

Код выведет путь вида `/var/www/html/upload/units`.

## Смотрите также

- [Path::convertSiteRelativeToAbsolute](convert-site-relative-to-absolute.md)
- [Path::combine](combine.md)
