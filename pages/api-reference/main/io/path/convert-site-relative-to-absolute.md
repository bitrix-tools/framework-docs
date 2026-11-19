---
title: Перевести путь от корня указанного сайта в абсолютный путь Path::convertSiteRelativeToAbsolute
description: Метод Path::convertSiteRelativeToAbsolute соединяет корень указанного сайта из его настроек с путем и нормализует результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertSiteRelativeToAbsolute` переводит путь от корня сайта в абсолютный путь. В отличие от [convertRelativeToAbsolute](convert-relative-to-absolute.md), метод берет корень из настроек указанного сайта методом `SiteTable::getDocumentRoot`. Метод нужен, если у сайтов разные корневые каталоги.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertSiteRelativeToAbsolute($relativePath, $site = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| relativePath\* | `string` | Задает путь от корня сайта |
| site | `?string` | Задает идентификатор сайта, например `s1`. По умолчанию — `null`, тогда `SiteTable::getDocumentRoot` берет сайт текущего контекста |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает нормализованный абсолютный путь. Метод не проверяет, существует ли файл.

Корень сайта метод берет из поля корневого каталога в настройках сайта. Относительный каталог метод соединяет с корнем сайта из `$_SERVER['DOCUMENT_ROOT']`. Если каталог в настройках не задан, метод берет корень сайта из `$_SERVER['DOCUMENT_ROOT']`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\InvalidPathException` | Путь содержит нулевой байт или частей `..` больше, чем частей перед ними |

## Особенности

Если путь пустой или не строка, метод берет сайт из константы `SITE_ID`, а не из параметра `site`, и возвращает корень этого сайта.

## Примеры

**Пример.** Код получает абсолютный путь к каталогу сайта `s1`:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Path::convertSiteRelativeToAbsolute('/upload/units', 's1');
```

Если корневой каталог сайта `s1` в настройках не задан, код выведет путь вида `/var/www/html/upload/units`.

## Смотрите также

- [Path::convertRelativeToAbsolute](convert-relative-to-absolute.md)
