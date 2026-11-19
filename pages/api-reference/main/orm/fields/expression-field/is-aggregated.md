---
title: Проверить, есть ли агрегатная функция ExpressionField::isAggregated
description: Метод ExpressionField::isAggregated проверяет, содержит ли полное выражение поля агрегатную функцию вне подзапросов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ExpressionField::isAggregated` проверяет, есть ли в выражении агрегатная функция, например `COUNT`, `SUM` или `MAX`. Если есть, запрос группирует строки по остальным полям `select`, `order` и условий `HAVING` и переносит условия по полю в `HAVING`. Если такое условие стоит в фильтре с `LOGIC => OR`, запрос переносит в `HAVING` весь фильтр.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\ExpressionField`:

```php
public function isAggregated()
```

## Возвращаемое значение

Метод возвращает `true`, если [checkAggregation](check-aggregation.md) нашел агрегатную функцию в [getFullExpression](get-full-expression.md), иначе `false`. Метод не учитывает функции внутри подзапросов `(SELECT ...)`.

## Особенности

- Метод запоминает результат.
- Оконные функции с `OVER`, а также `RANK`, `FIRST`, `LAST` и похожие метод считает агрегатными. Выражение с ними включит автоматическую группировку.
- Если в `buildFrom` есть поля, метод работает только после привязки к сущности.

## Примеры

**Пример.** Код проверяет два выражения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()
    ->registerRuntimeField(new ExpressionField('CNT', 'COUNT(*)'))
    ->registerRuntimeField(new ExpressionField('NAME_LEN', 'LENGTH(%s)', 'NAME'));

$entity = $query->getEntity();

var_export([$entity->getField('CNT')->isAggregated(), $entity->getField('NAME_LEN')->isAggregated()]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [ExpressionField::checkAggregation](check-aggregation.md)
- [ExpressionField::hasSubquery](has-subquery.md)
