---
title: Получить расширение файла Path::getExtension
description: Метод Path::getExtension возвращает часть имени файла после последней точки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::getExtension` возвращает расширение файла — часть имени после последней точки. Метод берет имя методом [getName](get-name.md), поэтому точки в именах каталогов не учитывает.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function getExtension($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь или имя файла |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает расширение без точки в исходном регистре или пустую строку, если в имени нет точки. Например, метод вернет:

- `gz` для `units.tar.gz`,
- `htaccess` для `.htaccess`,
- пустую строку для `README`.

Для строки не в UTF-8 метод возвращает пустую строку.

## Примеры

**Пример.** Код проверяет расширение загруженного файла без учета регистра:

```php
<?php
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$extension = mb_strtolower(Path::getExtension('/upload/units/Report.CSV'));

echo in_array($extension, ['csv', 'txt'], true) ? 'allowed' : 'denied';
```

Код выведет `allowed`.

## Смотрите также

- [Path::getName](get-name.md)
