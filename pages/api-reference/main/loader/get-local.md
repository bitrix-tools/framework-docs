---
title: Найти файл в /local/ или /bitrix/ Loader::getLocal
description: Метод Loader::getLocal возвращает полный путь к файлу из каталога /local/, а если там его нет — из /bitrix/.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::getLocal` ищет файл сначала в каталоге `/local/`, затем в `/bitrix/`. Метод нужен, чтобы файл из `/local/` заменял одноименный файл из `/bitrix/`, например файл маршрутов или шаблон.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function getLocal($path, $root = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь относительно `/local/` и `/bitrix/`, например `php_interface/init.php` |
| root | `?string` | Задает корень сайта. По умолчанию — `null`, тогда метод берет корень сайта из [getDocumentRoot](get-document-root.md) |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает абсолютный путь к найденному файлу или `false`, если файла нет ни в одном каталоге.

## Примеры

**Пример.** Код ищет файл модуля `main`:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Loader::getLocal('modules/main/include.php');

echo $path === false ? 'not found' : str_replace(Loader::getDocumentRoot(), '', $path);
```

Если в `/local/modules/` нет главного модуля, код выведет `/bitrix/modules/main/include.php`.

## Смотрите также

- [Loader::getPersonal](get-personal.md)
