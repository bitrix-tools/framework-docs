---
title: Записать данные в файл File::putFileContents
description: Метод File::putFileContents записывает данные в файл по пути, создает каталог при необходимости и возвращает число записанных байтов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.15

{% endnote %}

Метод `File::putFileContents` записывает данные в файл по пути. Метод создает объект `File` и вызывает его метод `putContents`.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public static function putFileContents($path, $data, $flags = self::REWRITE)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает полный путь к файлу |
| data\* | `string` | Задает данные для записи |
| flags | `int` | Задает режим записи. `File::REWRITE` заменяет содержимое, `File::APPEND` дописывает данные в конец. По умолчанию — `File::REWRITE` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает число записанных байтов или `false`, если записать не удалось.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\InvalidPathException` | Путь пустой, не строка, содержит нулевой байт или через `..` выходит за корень |

## Особенности

Если каталога файла нет, метод создает его со всеми родительскими каталогами. Если файл есть и защищен от записи, метод устанавливает ему права из константы `BX_FILE_PERMISSIONS`.

## Примеры

**Пример.** Код записывает две строки в файл, дописывает третью и выводит содержимое. В блоке `finally` код удаляет файл:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/demo-units.txt';

try
{
    File::putFileContents($path, "kg\nm\n");
    File::putFileContents($path, "l\n", File::APPEND);

    echo str_replace("\n", ' ', File::getFileContents($path));
}
finally
{
    File::deleteFile($path);
}
```

Код выведет `kg m l`.

## Смотрите также

- [File::getFileContents](get-file-contents.md)
- [File::deleteFile](delete-file.md)
