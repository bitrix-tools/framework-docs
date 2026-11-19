---
title: Найти файл в персональном каталоге Loader::getPersonal
description: Метод Loader::getPersonal ищет файл в персональном каталоге из $_SERVER['BX_PERSONAL_ROOT'], затем в /local/ и /bitrix/.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::getPersonal` ищет файл сначала в персональном каталоге, затем в `/local/` и `/bitrix/` методом [getLocal](get-local.md). Персональный каталог задает `$_SERVER['BX_PERSONAL_ROOT']`, например, если несколько сайтов работают на одном ядре.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function getPersonal($path)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь относительно персонального каталога |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает абсолютный путь к найденному файлу или `false`, если файла нет ни в одном каталоге. Если `$_SERVER['BX_PERSONAL_ROOT']` не задан, метод работает как `getLocal`.

## Примеры

**Пример.** Код ищет файл в персональном каталоге:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = Loader::getPersonal('modules/main/include.php');

echo $path === false ? 'not found' : str_replace(Loader::getDocumentRoot(), '', $path);
```

Без персонального каталога код выведет `/bitrix/modules/main/include.php`.

## Смотрите также

- [Loader::getLocal](get-local.md)
