---
title: Задать лимит Query::setLimit
description: Метод Query::setLimit задает наибольшее число записей, которое вернет запрос.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setLimit` задает наибольшее число записей, которое вернет запрос. Вместе с [setOffset](set-offset.md) метод делит выборку на страницы.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setLimit($limit)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| limit\* | `int` или `null` | Задает число записей. Значение `null` или `0` снимает лимит |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Запрос добавляет лимит в SQL при каждом построении, поэтому лимит можно менять и после [getQuery](get-query.md).

## Примеры

**Пример.** Код выбирает одну запись:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo count(LanguageTable::query()->setSelect(['LID'])->setLimit(1)->fetchAll());
```

Код выведет `1`.

## Смотрите также

- [Query::setOffset](set-offset.md)
- [Query::countTotal](count-total.md)
