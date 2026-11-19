---
title: Задать номер текущей страницы PageNavigation::setCurrentPage
description: Метод PageNavigation::setCurrentPage задает номер текущей страницы без проверки границ.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::setCurrentPage` задает номер текущей страницы. Метод нужен, когда номер приходит не из адреса, например из параметров AJAX-запроса.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function setCurrentPage($n)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| n\* | `int` | Задает номер страницы, начиная с 1. Метод приводит значение к целому числу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `PageNavigation`.

## Особенности

Метод не проверяет номер. Номер 0 или отрицательный номер дает отрицательное смещение в [getOffset](get-offset.md), номер больше числа страниц — пустую выборку. Проверяйте номер до вызова.

## Примеры

**Пример.** Код открывает вторую страницу:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setCurrentPage(2);

echo $nav->getCurrentPage() . ' ' . $nav->getOffset();
```

Код выведет `2 20`.

## Смотрите также

- [PageNavigation::getCurrentPage](get-current-page.md)
- [PageNavigation::initFromUri](init-from-uri.md)
