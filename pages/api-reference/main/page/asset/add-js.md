---
title: Добавить JS-файл Asset::addJs
description: Метод Asset::addJs добавляет JS-файл на страницу. Шаблон сайта выводит файл в секции head методом ShowHead.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::addJs` добавляет JS-файл на страницу. Метод `$APPLICATION->ShowHead()` в шаблоне сайта выводит файл в секции `<head>`. Локальный файл сайта попадает в текущий набор. В `header.php` и `footer.php` это набор шаблона, на странице и в компонентах — набор страницы. Файлы из `/bitrix/js/` и внешние адреса класс кладет в набор ядра.

Для библиотек и своих скриптов с зависимостями используйте расширения и `\Bitrix\Main\UI\Extension::load`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function addJs($path, $additional = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает путь к файлу от корня сайта, например `/local/js/units.js`, или внешний адрес |
| additional | `bool` | Значение `true` добавляет файл в набор шаблона. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`. Если путь пустой, метод возвращает `false`.

## Особенности

- Метод удаляет из пути параметры после `?` и подключает каждый файл один раз. У внешнего адреса параметры остаются.
- Если рядом лежит файл `.min.js`, ядро подключит его. Исходный файл ядро подключит, только если он новее.
- Ядро не подключит локальный файл, которого нет на диске или который пустой.

## Примеры

**Пример.** Код добавляет внешний скрипт и проверяет, что он попал в вывод:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->addJs('https://cdn.example.com/units.js?v=2');

var_dump(str_contains($asset->getJs(), '<script src="https://cdn.example.com/units.js?v=2"></script>'));
```

Код выведет `bool(true)`.

## Смотрите также

- [Расширения](../../../../framework/extensions.md)
- [Asset::getJs](get-js.md)
- [Asset::addCss](add-css.md)
