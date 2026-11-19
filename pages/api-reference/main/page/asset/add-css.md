---
title: Добавить CSS-файл Asset::addCss
description: Метод Asset::addCss добавляет CSS-файл на страницу. Шаблон сайта выводит файл в секции head методом ShowHead.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::addCss` добавляет CSS-файл на страницу. Метод `$APPLICATION->ShowHead()` в шаблоне сайта выводит файл в секции `<head>`. Локальный файл сайта попадает в текущий набор. В `header.php` и `footer.php` это набор шаблона, на странице и в компонентах — набор страницы. Файлы из `/bitrix/js/` и `/bitrix/css/` и внешние адреса класс кладет в набор ядра.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function addCss($path, $additional = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь к файлу от корня сайта, например `/local/css/units.css`, или внешний адрес |
| additional | `bool` | Значение `true` добавляет файл в набор шаблона после `styles.css` и `template_styles.css`. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`. Если путь пустой, метод возвращает `false`.

## Особенности

- Метод удаляет из пути параметры после `?` и подключает каждый файл один раз.
- Если рядом лежит файл `.min.css`, ядро подключит его. Исходный файл ядро подключит, только если он новее. Параметр `use_minified_assets` главного модуля со значением `N` отключает это.
- Ядро не подключит локальный файл, которого нет на диске или который пустой.
- Файлы, которые добавили после вывода CSS, на страницу не попадут.

## Примеры

**Пример.** Код добавляет файл и проверяет, что он попал в вывод:

```php
<?php
use Bitrix\Main\IO\File;
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = '/upload/vendor_units/units.css';
File::putFileContents($_SERVER['DOCUMENT_ROOT'] . $path, '.unit { color: #333; }');

$asset = Asset::getInstance();
$asset->disableOptimizeCss();
$asset->addCss($path);

var_dump(str_contains($asset->getCss(), $path));
File::deleteFile($_SERVER['DOCUMENT_ROOT'] . $path);
```

Код выведет `bool(true)`. Пример выключает объединение, чтобы файл вывелся своим тегом `link`.

## Смотрите также

- [Работа со стилями](../../../../cms-basics/styles.md)
- [Asset::getCss](get-css.md)
- [Asset::addJs](add-js.md)
