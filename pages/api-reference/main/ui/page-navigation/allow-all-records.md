---
title: Разрешить показ всех записей PageNavigation::allowAllRecords
description: Метод PageNavigation::allowAllRecords разрешает или запрещает показ всех записей на одной странице по значению page-all в адресе.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::allowAllRecords` разрешает или запрещает показ всех записей на одной странице. Если показ разрешен, [initFromUri](init-from-uri.md) принимает значение `page-all` из адреса, а компоненты навигации выводят ссылку «Все».

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function allowAllRecords($mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode\* | `bool` | Значение `true` разрешает показ всех записей, `false` запрещает. Метод приводит значение к `bool` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `PageNavigation`.

## Особенности

Вызывайте метод до [initFromUri](init-from-uri.md). Если вызвать метод после `initFromUri`, режим показа всех записей не изменится.

## Примеры

**Пример.** Код разрешает показ всех записей и читает `page-all` из адреса:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

// На реальной странице параметр приходит из адреса
Context::getCurrent()->getRequest()->modifyByQueryString('nav-units=page-all');

$nav = new PageNavigation('nav-units');
$nav->allowAllRecords(true)->setRecordCount(45);
$nav->initFromUri();

var_export([$nav->allRecordsShown(), $nav->getOffset(), $nav->getLimit()]);
```

Код выведет:

```text
array (
  0 => true,
  1 => 0,
  2 => 45,
)
```

## Смотрите также

- [PageNavigation::allRecordsAllowed](all-records-allowed.md)
- [PageNavigation::allRecordsShown](all-records-shown.md)
