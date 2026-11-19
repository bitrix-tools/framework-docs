---
title: Проверить, существует ли файл File::isFileExists
description: Метод File::isFileExists проверяет, есть ли по пути файл или рабочая символическая ссылка.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `File::isFileExists` проверяет, есть ли файл по пути. Метод создает объект `File` и вызывает его метод `isExists`.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public static function isFileExists($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает полный путь к файлу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если по пути есть файл или рабочая символическая ссылка, в том числе на каталог. Для обычного каталога и для битой ссылки метод возвращает `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\InvalidPathException` | Путь пустой, не строка, содержит нулевой байт или через `..` выходит за корень |

## Примеры

**Пример.** Код проверяет файл `.settings.php` и каталог `/bitrix`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$documentRoot = Application::getDocumentRoot();

var_dump(File::isFileExists($documentRoot . '/bitrix/.settings.php'));
var_dump(File::isFileExists($documentRoot . '/bitrix'));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [File::getFileContents](get-file-contents.md)
- [File::deleteFile](delete-file.md)
