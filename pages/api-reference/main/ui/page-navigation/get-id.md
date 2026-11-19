---
title: Получить идентификатор навигации PageNavigation::getId
description: Метод PageNavigation::getId возвращает идентификатор навигации — имя параметра в адресе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::getId` возвращает идентификатор навигации, который получил конструктор. Под этим именем адрес передает номер и размер страницы.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function getId()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код выводит идентификатор навигации:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');

echo $nav->getId();
```

Код выведет `nav-units`.

## Смотрите также

- [PageNavigation::__construct](construct.md)
