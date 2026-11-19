---
title: Удалить подзапросы из выражения ExpressionField::removeSubqueries
description: Статический метод ExpressionField::removeSubqueries удаляет из строки SQL-выражения подзапросы SELECT и строковые литералы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `ExpressionField::removeSubqueries` удаляет из строки SQL-выражения строковые литералы в кавычках и подзапросы `(SELECT ...)` вместе со скобками. Метод [checkAggregation](check-aggregation.md) вызывает его, чтобы не находить функции внутри подзапросов и строковых литералов.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public static function removeSubqueries($expression)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expression\* | `string` | Задает SQL-выражение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку без литералов и подзапросов. Вложенные подзапросы метод удаляет целиком.

## Особенности

Метод не удаляет `EXISTS` перед скобкой подзапроса. Результат нужен только для анализа, а не для выполнения.

## Примеры

**Пример.** Код удаляет подзапрос со строкой внутри:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo ExpressionField::removeSubqueries("MAX(%s) + (SELECT COUNT(*) FROM b_user WHERE NAME = 'a(b')");
```

Код выведет `MAX(%s) + `.

## Смотрите также

- [ExpressionField::checkAggregation](check-aggregation.md)
