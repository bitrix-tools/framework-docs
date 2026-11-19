---
title: Проверить, показаны ли все записи PageNavigation::allRecordsShown
description: Метод PageNavigation::allRecordsShown проверяет, выбрал ли пользователь показ всех записей на одной странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::allRecordsShown` проверяет, показаны ли все записи на одной странице. Метод [initFromUri](init-from-uri.md) включает этот режим, если адрес содержит `page-all` и показ всех записей разрешен.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function allRecordsShown()
```

## Возвращаемое значение

Метод возвращает `true`, если показаны все записи, иначе `false`.

В этом режиме [getOffset](get-offset.md) возвращает `0`, [getLimit](get-limit.md) — общее число записей, а [getPageCount](get-page-count.md) — `1`.

## Примеры

**Пример.** Код проверяет режим, когда показ всех записей не разрешен:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

// На реальной странице параметр приходит из адреса
Context::getCurrent()->getRequest()->modifyByQueryString('nav-units=page-all');

$nav = new PageNavigation('nav-units');
$nav->initFromUri();

var_dump($nav->allRecordsShown());
```

Код выведет `bool(false)`. Без `allowAllRecords(true)` метод `initFromUri` игнорирует `page-all`.

## Смотрите также

- [PageNavigation::allowAllRecords](allow-all-records.md)
- [PageNavigation::allRecordsAllowed](all-records-allowed.md)
