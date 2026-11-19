---
title: Перевести URI в путь в кодировке файловой системы Path::convertUriToPhysical
description: Метод Path::convertUriToPhysical декодирует части URI и переводит путь в кодировку файловой системы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::convertUriToPhysical` переводит URI в путь в кодировке файловой системы. Метод декодирует каждую часть функцией `rawurldecode` и переводит результат из UTF-8 в кодировку файловой системы, если они различаются.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function convertUriToPhysical($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь из URI без домена и строки запроса |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает путь. Метод не нормализует путь и не проверяет части `..`. Прежде чем открыть файл, переведите путь в абсолютный методом [convertRelativeToAbsolute](convert-relative-to-absolute.md) и проверьте, что результат начинается с нужного каталога.

## Примеры

**Пример.** Код переводит URI с закодированным пробелом в путь:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Path::convertUriToPhysical('/upload/units%20list/kg.txt');
```

На сервере с кодировкой файловой системы UTF-8 код выведет `/upload/units list/kg.txt`.

## Смотрите также

- [Path::convertLogicalToUri](convert-logical-to-uri.md)
- [Path::normalize](normalize.md)
