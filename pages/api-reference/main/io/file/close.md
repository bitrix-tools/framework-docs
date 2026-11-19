---
title: Закрыть файл File::close
description: Метод File::close закрывает файл, который открыл метод open.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.15

{% endnote %}

Метод `File::close` закрывает файл, который открыл метод [open](open.md), и сбрасывает сохраненный указатель.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public function close()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\FileNotOpenedException` | Файл не открыт методом [open](open.md) или уже закрыт |

## Примеры

**Пример.** Код закрывает файл дважды. Второй вызов выбрасывает исключение. В блоке `finally` код удаляет файл:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;
use Bitrix\Main\IO\FileNotOpenedException;
use Bitrix\Main\IO\FileStreamOpenMode;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Application::getDocumentRoot() . '/upload/demo-units.txt';
File::putFileContents($path, 'kg');

$file = new File($path);
try
{
    $file->open(FileStreamOpenMode::READ);
    $file->close();
    $file->close();
}
catch (FileNotOpenedException $e)
{
    echo 'File is not opened';
}
finally
{
    $file->delete();
}
```

Код выведет `File is not opened`.

## Смотрите также

- [File::open](open.md)
