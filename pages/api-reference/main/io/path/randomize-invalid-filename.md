---
title: Заменить недопустимые символы случайными буквами Path::randomizeInvalidFilename
description: Метод Path::randomizeInvalidFilename заменяет каждый недопустимый символ имени файла случайной строчной латинской буквой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::randomizeInvalidFilename` заменяет каждый недопустимый символ имени файла случайной строчной латинской буквой от `a` до `z`. Метод вызывает [replaceInvalidFilename](replace-invalid-filename.md) с такой функцией замены.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function randomizeInvalidFilename($filename)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filename\* | `string` | Задает имя файла |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает имя той же длины в символах, где вместо каждого недопустимого символа стоит случайная буква. При повторных вызовах метод возвращает разные имена. Нулевой байт метод не заменяет, как и [replaceInvalidFilename](replace-invalid-filename.md).

## Примеры

**Пример.** Код исправляет имя и проверяет результат:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filename = Path::randomizeInvalidFilename('kg:g?.txt');

echo mb_strlen($filename) . ' ' . var_export(Path::validateFilename($filename), true);
```

Код выведет `9 true`.

## Смотрите также

- [Path::replaceInvalidFilename](replace-invalid-filename.md)
