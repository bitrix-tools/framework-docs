---
title: Найти агрегатные функции ExpressionField::checkAggregation
description: Статический метод ExpressionField::checkAggregation находит в строке SQL-выражения агрегатные функции вне подзапросов и строковых литералов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `ExpressionField::checkAggregation` находит агрегатные функции в строке SQL-выражения. Метод [isAggregated](is-aggregated.md) вызывает его для полного выражения поля.

Метод знает агрегатные функции MySQL, PostgreSQL, MS SQL и Oracle, например `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP_CONCAT` и `STRING_AGG`. В список входят и оконные `OVER`, `RANK`, `FIRST`, `LAST`.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public static function checkAggregation($expression)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expression\* | `string` | Задает SQL-выражение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив имен найденных функций в том регистре, в котором они записаны. Если функций нет, метод возвращает пустой массив.

## Особенности

Перед поиском метод убирает подзапросы и строковые литералы методом [removeSubqueries](remove-subqueries.md). Метод не находит функции внутри них.

## Примеры

**Пример.** Код ищет агрегатные функции в трех выражениях:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

foreach (['SUM(%s) / count(%s)', 'LENGTH(%s)', '(SELECT MAX(ID) FROM b_user)'] as $expression)
{
    echo '[' . implode(',', ExpressionField::checkAggregation($expression)) . '] ';
}
```

Код выведет `[SUM,count] [] []`.

## Смотрите также

- [ExpressionField::isAggregated](is-aggregated.md)
- [ExpressionField::removeSubqueries](remove-subqueries.md)
