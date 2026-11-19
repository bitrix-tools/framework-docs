---
title: Открыть файл File::open
description: Метод File::open открывает файл в заданном режиме и возвращает указатель для потоковых функций PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `File::open` открывает файл и возвращает указатель. Код передает указатель в функции PHP `fread`, `fwrite`, `fgets` и другие, чтобы читать или писать файл по частям. Объект запоминает указатель для [seek](seek.md) и [close](close.md).

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public function open($mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode\* | `string` | Задает режим открытия функции `fopen`, например константу `FileStreamOpenMode::READ`. Метод сам добавляет к режиму `b` — двоичный режим |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает указатель на открытый файл типа `resource`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\FileOpenException` | Функция `fopen` не открыла файл, например его нет при чтении или нет прав |

Функция `fopen` при ошибке генерирует предупреждение PHP. Выведет ли его ядро или превратит в `\ErrorException` вместо `FileOpenException`, зависит от настроек секции `exception_handling` в `.settings.php`.

## Примеры

**Пример.** Код записывает файл, открывает его на чтение и выводит первую строку. В блоке `finally` код удаляет файл:

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
    echo trim(fgets($handle));
    $file->close();
}
finally
{
    $file->delete();
}
```

Код выведет `kg`.

## Смотрите также

- [File::close](close.md)
- [File::seek](seek.md)
