---
title: Получить условия ConditionTree::getConditions
description: Метод ConditionTree::getConditions возвращает условия и вложенные деревья в порядке добавления.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::getConditions` возвращает условия дерева первого уровня. Метод нужен, чтобы разобрать или изменить готовый фильтр, например убрать условие перед повторным запросом.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function getConditions()
```

## Возвращаемое значение

Метод возвращает массив. Элемент — условие `Bitrix\Main\ORM\Query\Filter\Condition` или вложенное дерево `ConditionTree`. Методы условия `getColumn`, `getOperator` и `getValue` возвращают поле, оператор и значение.

## Особенности

- Методы с отрицанием, например `whereNotIn`, добавляют вложенное дерево, а не условие.
- Для условия из `whereExpr` метод `getColumn` возвращает объект `ExpressionField`, а не строку.
- После [removeCondition](remove-condition.md) метод возвращает массив с прежними ключами. Перебирайте массив в `foreach`, а не по индексам.

## Примеры

**Пример.** Код выводит части условий фильтра:

```php
<?php
use Bitrix\Main\ORM\Query\Filter\Condition;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->where('SORT', '>', 1)->whereIn('LID', ['en', 'ru']);

foreach ($filter->getConditions() as $condition)
{
    if ($condition instanceof Condition)
    {
        echo $condition->getColumn() . ' ' . $condition->getOperator() . "\n";
    }
}
```

Код выведет:

```text
SORT >
LID in
```

## Смотрите также

- [ConditionTree::hasConditions](has-conditions.md)
- [ConditionTree::removeCondition](remove-condition.md)
