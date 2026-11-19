---
title: Удалить условие ConditionTree::removeCondition
description: Метод ConditionTree::removeCondition удаляет первое условие дерева, равное переданному.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::removeCondition` удаляет условие первого уровня. Метод удаляет только одно — первое найденное — условие.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function removeCondition($condition)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| condition\* | `Condition` или `ConditionTree` | Задает условие. Метод сравнивает через `==`, поэтому подходит и новый объект с теми же полем, оператором и значением |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если нашел и удалил условие, иначе `false`.

## Особенности

- Метод не перенумеровывает ключи массива [getConditions](get-conditions.md). После удаления первого условия в массиве нет ключа `0`.
- В отличие от [replaceCondition](replace-condition.md), метод сравнивает условия по значению, а не по объекту.

## Примеры

**Пример.** Код удаляет условие, созданное заново с теми же значениями:

```php
<?php
use Bitrix\Main\ORM\Query\Filter\Condition;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->where('LID', 'en')->where('SORT', '>', 1);
$removed = $filter->removeCondition(new Condition('LID', '=', 'en'));

echo var_export($removed, true) . ' ' . implode(',', array_keys($filter->getConditions()));
```

Код выведет `true 1`.

## Смотрите также

- [ConditionTree::removeAllConditions](remove-all-conditions.md)
- [ConditionTree::replaceCondition](replace-condition.md)
