---
title: Получить число страниц PageNavigation::getPageCount
description: Метод PageNavigation::getPageCount возвращает число страниц по общему числу записей и размеру страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getPageCount` возвращает число страниц. Метод делит общее число записей из [setRecordCount](set-record-count.md) на размер страницы и округляет результат вверх.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getPageCount()
```

## Возвращаемое значение

Метод возвращает целое число. Если число записей не задано, метод возвращает `0`. Если показаны все записи на одной странице, метод возвращает `1`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\DivisionByZeroError` | Размер страницы равен 0 |

## Примеры

**Пример.** Код считает страницы для 45 записей по 20 на странице:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setRecordCount(45);

echo $nav->getPageCount();
```

Код выведет `3`.

## Смотрите также

- [PageNavigation::setRecordCount](set-record-count.md)
- [PageNavigation::setPageSize](set-page-size.md)
