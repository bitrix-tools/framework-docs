---
title: Заменить недопустимые символы имени файла Path::replaceInvalidFilename
description: Метод Path::replaceInvalidFilename заменяет недопустимые символы имени файла значением, которое вернула функция обратного вызова.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::replaceInvalidFilename` заменяет каждый недопустимый символ имени файла. Метод вызывает функцию PHP `preg_replace_callback` и передает в нее функцию обратного вызова.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function replaceInvalidFilename($filename, $callback)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filename\* | `string` | Задает имя файла |
| callback\* | `callable` | Задает функцию, которая получает массив совпадений, где элемент `0` — недопустимый символ, и возвращает строку замены |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает имя с замененными символами. Метод заменяет символы из константы `INVALID_FILENAME_CHARS`, управляющие символы с кодами от 1 до 31 и символ U+202E.

Метод не заменяет нулевой байт и не исправляет пустое имя или имя из одних пробелов. Такие имена [validateFilename](validate-filename.md) отклонит и после замены.

## Примеры

**Пример.** Код заменяет каждый недопустимый символ его кодом:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filename = Path::replaceInvalidFilename('kg:g?.txt', static function (array $match)
{
    return '_' . ord($match[0]) . '_';
});

echo $filename;
```

Код выведет `kg_58_g_63_.txt`.

## Смотрите также

- [Path::randomizeInvalidFilename](randomize-invalid-filename.md)
- [Path::validateFilename](validate-filename.md)
