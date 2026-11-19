---
title: Получить смещение первой записи PageNavigation::getOffset
description: Метод PageNavigation::getOffset возвращает смещение первой записи текущей страницы для параметра offset в getList.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getOffset` возвращает смещение первой записи текущей страницы. Передайте значение в параметр `offset` метода `getList`.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getOffset()
```

## Возвращаемое значение

Метод возвращает целое число — `(номер страницы - 1) * размер страницы`. Если показаны все записи на одной странице, метод возвращает `0`.

## Примеры

**Пример.** Код считает смещение для третьей страницы по 20 записей:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setCurrentPage(3);

echo $nav->getOffset();
```

Код выведет `40`.

## Смотрите также

- [PageNavigation::getLimit](get-limit.md)
- [PageNavigation::setCurrentPage](set-current-page.md)
