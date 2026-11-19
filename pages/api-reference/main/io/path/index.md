---
title: Path — операции с путями
description: Класс Bitrix\Main\IO\Path нормализует и объединяет пути, выделяет имя, каталог и расширение, проверяет имена файлов и переводит пути в URI.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\IO`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `Path` содержит статические методы для работы со строкой пути. Методы не проверяют, существует ли путь. Объект класса создавать не нужно.

Основные методы класса:

- [combine](combine.md) — собирает путь из частей и нормализует его,
- [normalize](normalize.md) — убирает повторные косые черты, `.` и `..`,
- [getName](get-name.md), [getDirectory](get-directory.md) и [getExtension](get-extension.md) — выделяют части пути,
- [validateFilename](validate-filename.md) — проверяет имя файла, которое пришло от пользователя.

Класс работает с разделителем `/`. Методы не считают обратную косую черту разделителем. Исключение — Windows, там метод `normalize` и методы, которые его вызывают, например `combine`, заменяют обратную косую черту на `/`.

Для операций с файлами используйте класс [File](../file/index.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [combine](combine.md) | Собирает путь из частей и нормализует его | |
| [normalize](normalize.md) | Приводит путь к каноническому виду | |
| [getName](get-name.md) | Возвращает имя файла или каталога из пути | |
| [getDirectory](get-directory.md) | Возвращает путь к родительскому каталогу | |
| [getExtension](get-extension.md) | Возвращает расширение файла | |
| [isAbsolute](is-absolute.md) | Проверяет, абсолютный ли путь | |
| [convertRelativeToAbsolute](convert-relative-to-absolute.md) | Переводит путь от корня сайта в абсолютный путь | |
| [convertSiteRelativeToAbsolute](convert-site-relative-to-absolute.md) | Переводит путь от корня указанного сайта в абсолютный путь | |
| [validate](validate.md) | Проверяет абсолютный путь на недопустимые символы | |
| [validateFilename](validate-filename.md) | Проверяет имя файла на недопустимые символы | |
| [replaceInvalidFilename](replace-invalid-filename.md) | Заменяет недопустимые символы имени файла | |
| [randomizeInvalidFilename](randomize-invalid-filename.md) | Заменяет недопустимые символы имени файла случайными буквами | |
| [convertLogicalToUri](convert-logical-to-uri.md) | Переводит путь в URI | |
| [convertPhysicalToUri](convert-physical-to-uri.md) | Переводит путь из кодировки файловой системы в URI | |
| [convertUriToPhysical](convert-uri-to-physical.md) | Переводит URI в путь в кодировке файловой системы | |
| [convertLogicalToPhysical](convert-logical-to-physical.md) | Переводит путь в кодировку файловой системы | |
| [convertPhysicalToLogical](convert-physical-to-logical.md) | Переводит путь из кодировки файловой системы в UTF-8 | |

## Константы

| Константа | Значение | Назначение |
| --- | --- | --- |
| `DIRECTORY_SEPARATOR` | `/` | Разделитель частей пути |
| `INVALID_FILENAME_CHARS` | Обратная и прямая косые черты, `:`, `*`, `?`, двойная и одинарная кавычки, `<`, `>`, вертикальная черта, `~`, `#`, `&`, `;` | Символы, недопустимые в имени файла. Метод `validate` допускает в пути символ `/` |
| `INVALID_FILENAME_BYTES` | Байты символа U+202E | Символ смены направления текста, недопустимый в имени файла и пути |

Методы проверки имени и пути также запрещают управляющие символы с кодами от 1 до 31 и нулевой байт.

## Смотрите также

- [File](../file/index.md)
- [Loader](../../loader/index.md)
