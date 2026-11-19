---
title: Переместить указатель файла File::seek
description: Метод File::seek перемещает указатель открытого файла на позицию от начала файла.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.15

{% endnote %}

Метод `File::seek` перемещает указатель файла, который открыл метод [open](open.md), на позицию от начала файла.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public function seek($position)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| position\* | `int`, `float` | Задает позицию в байтах от начала файла. Если значение больше `PHP_INT_MAX`, метод перемещает указатель несколькими шагами |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает результат функции `fseek` — `0` при успехе и `-1` при ошибке.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\FileNotOpenedException` | Файл не открыт методом [open](open.md) или уже закрыт |

## Примеры

**Пример.** Код открывает файл, пропускает первые три байта и читает следующую строку. В блоке `finally` код удаляет файл:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;
use Bitrix\Main\IO\FileStreamOpenMode;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/demo-units.txt';
File::putFileContents($path, "kg\nm\n");

$file = new File($path);
try
{
    $handle = $file->open(FileStreamOpenMode::READ);
    $file->seek(3);
    echo trim(fgets($handle));
    $file->close();
}
finally
{
    $file->delete();
}
```

Код выведет `m`.

## Смотрите также

- [File::open](open.md)
- [File::close](close.md)
