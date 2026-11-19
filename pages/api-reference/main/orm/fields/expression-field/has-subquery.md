---
title: Проверить, есть ли подзапрос ExpressionField::hasSubquery
description: Метод ExpressionField::hasSubquery проверяет, содержит ли полное выражение поля подзапрос SELECT или EXISTS.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::hasSubquery` проверяет, есть ли в выражении подзапрос `(SELECT ...)` или `EXISTS(...)`. Запрос учитывает подзапросы, когда строит группировку.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function hasSubquery()
```

## Возвращаемое значение

Метод возвращает `true`, если [checkSubquery](check-subquery.md) нашел подзапрос в [getFullExpression](get-full-expression.md), иначе `false`.

## Особенности

Метод запоминает результат.

## Примеры

**Пример.** Код проверяет выражение с подзапросом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->registerRuntimeField(
    new ExpressionField('USERS', '(SELECT COUNT(*) FROM b_user)')
);
$field = $query->getEntity()->getField('USERS');

var_export([$field->hasSubquery(), $field->isAggregated()]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

`COUNT` стоит внутри подзапроса, поэтому [isAggregated](is-aggregated.md) возвращает `false`.

## Смотрите также

- [ExpressionField::checkSubquery](check-subquery.md)
