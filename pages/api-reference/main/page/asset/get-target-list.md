---
title: Получить список наборов Asset::getTargetList
description: Метод Asset::getTargetList возвращает список наборов страницы вместе с вложенными наборами для CSS или JS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getTargetList` возвращает список наборов страницы вместе с вложенными наборами. Вложенный набор `KERNEL_main` есть с начала запроса. Остальные вложенные наборы создают [getCss](get-css.md) и [getJs](get-js.md) для файлов ядра и внешних файлов.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getTargetList($type = 'CSS')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| type | `string` | Значение `'CSS'` возвращает наборы CSS, любое другое — наборы JS. По умолчанию — `'CSS'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив наборов. Каждый элемент содержит ключи `NAME`, `PARENT_NAME`, `UNIQUE`, `PREFIX`, `MODE` и `MODULE_NAME`.

## Особенности

Метод запоминает список при первом вызове для каждого типа. Наборы, которые появились потом, в список не попадут. Если вызвать метод раньше [getCss](get-css.md), `getCss` не выведет файлы ядра, поэтому вызывайте метод после вывода.

## Примеры

**Пример.** Код начинает свой набор и выводит имена наборов:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startTarget('units');

echo implode(',', array_column($asset->getTargetList('JS'), 'NAME'));
```

Код выведет `KERNEL,KERNEL_main,PAGE,TEMPLATE,BODY,UNITS`.

## Смотрите также

- [Asset::getAssetInfo](get-asset-info.md)
