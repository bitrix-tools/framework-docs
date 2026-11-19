---
title: Получить размер страницы PageNavigation::getPageSize
description: Метод PageNavigation::getPageSize возвращает заданный размер страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getPageSize` возвращает размер страницы. Если показаны все записи, метод все равно возвращает заданный размер. Метод [getLimit](get-limit.md) возвращает лимит выборки для запроса.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getPageSize()
```

## Возвращаемое значение

Метод возвращает целое число. По умолчанию — `20`.

## Примеры

**Пример.** Код задает размер и читает его:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setPageSize(50);

echo $nav->getPageSize();
```

Код выведет `50`.

## Смотрите также

- [PageNavigation::setPageSize](set-page-size.md)
- [PageNavigation::getLimit](get-limit.md)
