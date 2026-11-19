---
title: Получить MIME-тип файла File::getContentType
description: Метод File::getContentType определяет MIME-тип файла по его содержимому через расширение fileinfo.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `File::getContentType` определяет MIME-тип файла по содержимому, а не по расширению имени. Метод использует функции расширения PHP `fileinfo`.

Сигнатура метода в классе `Bitrix\Main\IO\File`:

```php
public function getContentType()
```

## Возвращаемое значение

Метод возвращает строку с MIME-типом, например `text/plain` или `image/png`. Если определить тип не удалось, метод возвращает `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\FileNotFoundException` | Файла нет |

## Особенности

Метод передает в `finfo_file` путь из конструктора, а не путь в кодировке файловой системы. Для путей с символами не из ASCII результат зависит от того, совпадает ли кодировка сайта с кодировкой файловой системы.

## Примеры

**Пример.** Код записывает текст в файл с расширением `.png` и выводит MIME-тип. В блоке `finally` код удаляет файл:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\File;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$file = new File(Application::getDocumentRoot() . '/upload/demo-units.png');
try
{
    $file->putContents("Unit list: kg, m, l\n");
    echo $file->getContentType();
}
finally
{
    $file->delete();
}
```

Код выведет `text/plain`.

## Смотрите также

- [File::isFileExists](is-file-exists.md)
