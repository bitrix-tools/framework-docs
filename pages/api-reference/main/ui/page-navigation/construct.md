---
title: Создать объект навигации PageNavigation::__construct
description: Конструктор PageNavigation создает объект постраничной навигации с идентификатором — именем параметра в адресе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `PageNavigation::__construct` создает объект постраничной навигации. Идентификатор объекта — имя параметра, в котором адрес передает номер и размер страницы.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function __construct(string $id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает идентификатор навигации, например `nav-units`. Если на странице несколько списков, задайте каждому свой идентификатор |

## Особенности

Новый объект показывает первую страницу по 20 записей. Показ всех записей на одной странице запрещен, допустимых размеров страницы нет, число записей не задано.

## Примеры

**Пример.** Код создает объект и выводит настройки по умолчанию:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');

echo $nav->getId() . ' ' . $nav->getCurrentPage() . ' ' . $nav->getPageSize();
```

Код выведет `nav-units 1 20`.

## Смотрите также

- [PageNavigation::initFromUri](init-from-uri.md)
- [PageNavigation::getId](get-id.md)
