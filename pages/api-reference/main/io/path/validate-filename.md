---
title: Проверить имя файла Path::validateFilename
description: Метод Path::validateFilename проверяет, что имя файла не пустое и не содержит недопустимых символов, в том числе косых черт.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::validateFilename` проверяет имя файла без пути. Метод нужен, когда имя пришло от пользователя, например при загрузке файла.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function validateFilename($filename)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filename\* | `string` | Задает имя файла |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если имя без пробелов по краям не пустое и не содержит недопустимых символов. Недопустимы символы из константы `INVALID_FILENAME_CHARS`, в том числе обе косые черты, а также управляющие символы, нулевой байт и символ смены направления текста U+202E. Иначе метод возвращает `false`.

Кириллица и пробелы в имени допустимы. Чтобы исправить недопустимое имя, используйте [replaceInvalidFilename](replace-invalid-filename.md).

## Примеры

**Пример.** Код проверяет имя файла и заменяет недопустимые символы, если проверка не прошла:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filename = 'units:kg/g.txt';

if (!Path::validateFilename($filename))
{
    $filename = Path::replaceInvalidFilename($filename, static fn() => '_');
}

echo $filename;
```

Код выведет `units_kg_g.txt`.

## Смотрите также

- [Path::replaceInvalidFilename](replace-invalid-filename.md)
- [Path::validate](validate.md)
