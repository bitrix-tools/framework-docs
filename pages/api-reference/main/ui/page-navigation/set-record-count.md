---
title: Задать число записей PageNavigation::setRecordCount
description: Метод PageNavigation::setRecordCount задает общее число записей, по которому объект считает число страниц.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::setRecordCount` задает общее число записей в списке. Метод [getPageCount](get-page-count.md) считает по нему число страниц, а компоненты навигации выводят ссылки. Общее число записей возвращает, например, метод `getCount` результата `getList` с параметром `count_total`.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function setRecordCount($n)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| n\* | `int` | Задает общее число записей. Метод приводит значение к целому числу |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `PageNavigation`.

## Особенности

- Если вызвать метод до [initFromUri](init-from-uri.md), `initFromUri` ограничит номер страницы из адреса числом страниц.
- При числе записей 0 такое ограничение дает номер страницы 0 и отрицательное смещение. Вызывайте метод после `initFromUri` или только при числе записей больше нуля.

## Примеры

**Пример.** Код выбирает страницу пользователей и передает навигации общее число записей:

```php
<?php
use Bitrix\Main\UI\PageNavigation;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-users');
$nav->setPageSize(10);
$nav->initFromUri();

$result = UserTable::getList([
    'select' => ['ID', 'LOGIN'],
    'order' => ['ID' => 'ASC'],
    'offset' => $nav->getOffset(),
    'limit' => $nav->getLimit(),
    'count_total' => true,
]);

$nav->setRecordCount($result->getCount());

echo ($nav->getPageCount() >= 1 ? 'pages counted' : 'no pages');
```

Код выведет `pages counted`.

## Смотрите также

- [PageNavigation::getRecordCount](get-record-count.md)
- [PageNavigation::getPageCount](get-page-count.md)
