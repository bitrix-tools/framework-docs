---
title: Проверить строку на подзапрос ExpressionField::checkSubquery
description: Статический метод ExpressionField::checkSubquery проверяет, есть ли в строке SQL-выражения подзапрос SELECT или EXISTS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `ExpressionField::checkSubquery` проверяет, есть ли в строке SQL-выражения подзапрос, то есть скобка с `SELECT` или `EXISTS(`. Метод [hasSubquery](has-subquery.md) вызывает его для полного выражения поля.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public static function checkSubquery($expression)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expression\* | `string` | Задает SQL-выражение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если нашел подзапрос, иначе `false`.

## Особенности

Метод не учитывает регистр букв.

## Примеры

**Пример.** Код проверяет три выражения:

```php
<?php
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_export([
    ExpressionField::checkSubquery('EXISTS (SELECT 1 FROM b_user)'),
    ExpressionField::checkSubquery('(select MAX(ID) FROM b_user)'),
    ExpressionField::checkSubquery('LENGTH(%s)'),
]);
```

Код выведет:

```text
array (
  0 => true,
  1 => true,
  2 => false,
)
```

## Смотрите также

- [ExpressionField::hasSubquery](has-subquery.md)
