---
title: Удалить файл File::deleteFile
description: Метод File::deleteFile удаляет файл по пути и возвращает true, если файл удален или его не было.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `File::deleteFile` удаляет файл по пути. Метод создает объект `File` и вызывает его метод `delete`.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public static function deleteFile($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает полный путь к файлу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если файл удален или его не было. Если удалить файл не удалось, метод возвращает `false`. Для пути к каталогу метод возвращает `true` и ничего не удаляет.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\InvalidPathException` | Путь пустой, не строка, содержит нулевой байт или через `..` выходит за корень |

## Примеры

**Пример.** Код создает файл, удаляет его и проверяет, что файла нет:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/demo-units.txt';

File::putFileContents($path, 'kg');

var_dump(File::deleteFile($path));
var_dump(File::isFileExists($path));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [File::isFileExists](is-file-exists.md)
- [File::putFileContents](put-file-contents.md)
