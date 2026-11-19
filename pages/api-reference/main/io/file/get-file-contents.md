---
title: Прочитать файл File::getFileContents
description: Метод File::getFileContents возвращает содержимое файла по пути или выбрасывает исключение, если файла нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `File::getFileContents` возвращает содержимое файла по пути. Метод создает объект `File` и вызывает его метод `getContents`.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public static function getFileContents($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает полный путь к файлу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает содержимое файла строкой. Если прочитать существующий файл не удалось, метод возвращает `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\FileNotFoundException` | Файла нет |
| `Bitrix\Main\IO\InvalidPathException` | Путь пустой, не строка, содержит нулевой байт или через `..` выходит за корень |

## Примеры

**Пример.** Код читает файл, которого может не быть, и выводит сообщение вместо исключения:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;
use Bitrix\Main\IO\FileNotFoundException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/demo-missing-units.txt';

try
{
    echo File::getFileContents($path);
}
catch (FileNotFoundException $e)
{
    echo 'File not found';
}
```

Код выведет `File not found`.

## Смотрите также

- [File::isFileExists](is-file-exists.md)
- [File::putFileContents](put-file-contents.md)
