---
title: Получить номер текущей страницы PageNavigation::getCurrentPage
description: Метод PageNavigation::getCurrentPage возвращает номер текущей страницы или 1, если номер не задан.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getCurrentPage` возвращает номер текущей страницы.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getCurrentPage()
```

## Возвращаемое значение

Метод возвращает целое число. Если номер не задан ни адресом, ни методом [setCurrentPage](set-current-page.md), метод возвращает `1`.

## Примеры

**Пример.** Код читает номер страницы до и после изменения:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$before = $nav->getCurrentPage();
$nav->setCurrentPage(4);

echo $before . ' ' . $nav->getCurrentPage();
```

Код выведет `1 4`.

## Смотрите также

- [PageNavigation::setCurrentPage](set-current-page.md)
