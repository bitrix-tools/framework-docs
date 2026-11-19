---
title: Получить лимит выборки PageNavigation::getLimit
description: Метод PageNavigation::getLimit возвращает лимит выборки — число записей текущей страницы для параметра limit в getList.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getLimit` возвращает лимит выборки — число записей на текущей странице. Передайте значение в параметр `limit` метода `getList`.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getLimit()
```

## Возвращаемое значение

Метод возвращает размер страницы.

Если показаны все записи на одной странице, метод возвращает общее число записей из [setRecordCount](set-record-count.md). Если показаны все записи, а `setRecordCount` не вызван, метод возвращает `null`, и `getList` выбирает записи без ограничения.

## Примеры

**Пример.** Код сравнивает лимит обычной страницы и страницы со всеми записями:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$before = $nav->getLimit();

// На реальной странице параметр приходит из адреса
Context::getCurrent()->getRequest()->modifyByQueryString('nav-units=page-all');

$nav->allowAllRecords(true);
$nav->initFromUri();

var_export([$before, $nav->getLimit()]);
```

Код выведет:

```text
array (
  0 => 20,
  1 => NULL,
)
```

## Смотрите также

- [PageNavigation::getOffset](get-offset.md)
- [PageNavigation::allowAllRecords](allow-all-records.md)
