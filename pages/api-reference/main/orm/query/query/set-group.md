---
title: Задать поля группировки Query::setGroup
description: Метод Query::setGroup задает поля для GROUP BY и заменяет прежние.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setGroup` задает поля группировки `GROUP BY` и заменяет прежние.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setGroup($group)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| group\* | `string` или `array` | Задает поле или массив полей |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Если в запросе есть агрегация, запрос сам добавит в `GROUP BY` поля выборки, сортировки и `HAVING` без агрегатных функций. Поэтому для простой группировки достаточно выбрать поле и выражение.

## Примеры

**Пример.** Код считает языки по признаку активности:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()
    ->setSelect(['ACTIVE', new ExpressionField('CNT', 'COUNT(*)')])
    ->setGroup('ACTIVE')
    ->fetchAll();

echo json_encode($rows);
```

Код выведет `[{"ACTIVE":"Y","CNT":"2"}]`, если оба языка активны.

## Смотрите также

- [Query::addGroup](add-group.md)
- [Query::hasAggregation](has-aggregation.md)
