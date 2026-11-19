---
title: Получить число записей PageNavigation::getRecordCount
description: Метод PageNavigation::getRecordCount возвращает общее число записей или null, если число не задано.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getRecordCount` возвращает общее число записей, которое задал [setRecordCount](set-record-count.md).

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getRecordCount()
```

## Возвращаемое значение

Метод возвращает целое число или `null`, если число записей не задано.

## Примеры

**Пример.** Код читает число записей до и после `setRecordCount`:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$before = $nav->getRecordCount();
$nav->setRecordCount(45);

var_export([$before, $nav->getRecordCount()]);
```

Код выведет:

```text
array (
  0 => NULL,
  1 => 45,
)
```

## Смотрите также

- [PageNavigation::setRecordCount](set-record-count.md)
