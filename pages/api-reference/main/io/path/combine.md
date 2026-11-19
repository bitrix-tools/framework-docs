---
title: Собрать путь из частей Path::combine
description: Метод Path::combine соединяет части пути через косую черту и нормализует результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Path::combine` соединяет части пути через `/` и нормализует результат методом [normalize](normalize.md). Метод убирает повторные косые черты на стыках частей.

Сигнатура метода в классе `Bitrix\Main\IO\Path`:

```php
public static function combine(...$args)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| ...args | `string` или `array` | Задают части пути. Каждая часть — отдельный аргумент. Массив метод разворачивает в части. Пустые строки и значения других типов, например числа и `null`, метод пропускает |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает нормализованный путь. Если непустых строк нет, метод возвращает пустую строку.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\IO\InvalidPathException` | Собранный путь содержит нулевой байт или частей `..` больше, чем частей перед ними |

## Примеры

**Пример.** Код собирает путь к файлу из корня сайта, каталога и имени файла:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\IO\Path;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Path::combine(Application::getDocumentRoot(), '/upload/units/', 'kg.txt');

echo $path;
```

Код выведет путь вида `/var/www/html/upload/units/kg.txt`.

## Смотрите также

- [Path::normalize](normalize.md)
- [Path::convertRelativeToAbsolute](convert-relative-to-absolute.md)
