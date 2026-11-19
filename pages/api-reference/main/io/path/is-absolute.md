---
title: Проверить, абсолютный ли путь Path::isAbsolute
description: Метод Path::isAbsolute проверяет, начинается ли путь с косой черты или с буквы диска Windows.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::isAbsolute` проверяет, абсолютный ли путь. Метод проверяет только начало строки и не обращается к файловой системе.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function isAbsolute($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если путь начинается с `/` или с буквы диска и `:/`, например `C:/upload`. В остальных случаях метод возвращает `false`, в том числе для пути `C:\upload` с обратной косой чертой.

## Примеры

**Пример.** Код дополняет относительный путь корнем сайта:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = 'upload/units/kg.txt';

if (!Path::isAbsolute($path))
{
    $path = Path::convertRelativeToAbsolute($path);
}

echo Path::getName(Path::getDirectory($path));
```

Код выведет `units`.

## Смотрите также

- [Path::convertRelativeToAbsolute](convert-relative-to-absolute.md)
