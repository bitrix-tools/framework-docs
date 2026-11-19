---
title: Получить допустимые размеры страницы PageNavigation::getPageSizes
description: Метод PageNavigation::getPageSizes возвращает список размеров страницы, который задал setPageSizes.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getPageSizes` возвращает размеры страницы, которые пользователь может выбрать. Шаблон `admin` компонента `main.pagenavigation` выводит этот список для выбора.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getPageSizes()
```

## Возвращаемое значение

Метод возвращает массив, который задал [setPageSizes](set-page-sizes.md). По умолчанию — пустой массив.

## Примеры

**Пример.** Код задает размеры и выводит их:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$nav->setPageSizes([20, 50, 100]);

echo implode(',', $nav->getPageSizes());
```

Код выведет `20,50,100`.

## Смотрите также

- [PageNavigation::setPageSizes](set-page-sizes.md)
