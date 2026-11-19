---
title: Задать размер страницы PageNavigation::setPageSize
description: Метод PageNavigation::setPageSize задает размер страницы и возвращает тот же объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::setPageSize` задает размер страницы. Метод [initFromUri](init-from-uri.md) может заменить размер значением из адреса, если оно есть в списке [setPageSizes](set-page-sizes.md).

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function setPageSize($n)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| n\* | `int` | Задает размер страницы. Метод приводит значение к целому числу. Размер 0 приводит к ошибке в [getPageCount](get-page-count.md) |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `PageNavigation`, поэтому вызовы можно объединять в цепочку.

## Примеры

**Пример.** Код задает 10 записей на странице и переходит на третью страницу:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setPageSize(10)->setCurrentPage(3);

echo $nav->getOffset() . ' ' . $nav->getLimit();
```

Код выведет `20 10`.

## Смотрите также

- [PageNavigation::getPageSize](get-page-size.md)
- [PageNavigation::setPageSizes](set-page-sizes.md)
