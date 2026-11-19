---
title: Проверить абсолютный путь Path::validate
description: Метод Path::validate проверяет, что строка — абсолютный путь без недопустимых символов и повторных косых черт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::validate` проверяет, что строка — абсолютный путь без недопустимых символов. Метод проверяет только строку и не обращается к файловой системе.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function validate($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если путь подходит под все условия:

- начинается с `/` или с буквы диска и `:/`, например `C:/upload`,
- не содержит повторных косых черт, например `/upload//units`,
- не содержит символов из константы `INVALID_FILENAME_CHARS`, кроме `/`,
- не содержит управляющих символов, нулевого байта и символа смены направления текста U+202E.

Иначе метод возвращает `false`. Для относительного пути, пустой строки и не строки метод возвращает `false`. Кириллица и пробелы в пути допустимы.

## Примеры

**Пример.** Код проверяет три пути:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (['/upload/units/kg.txt', 'upload/kg.txt', '/upload/k:g.txt'] as $path)
{
    echo $path . ' ' . var_export(Path::validate($path), true) . PHP_EOL;
}
```

Код выведет:

```text
/upload/units/kg.txt true
upload/kg.txt false
/upload/k:g.txt false
```

## Смотрите также

- [Path::validateFilename](validate-filename.md)
- [Path::normalize](normalize.md)
