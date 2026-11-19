---
title: Проверить, есть ли условия ConditionTree::hasConditions
description: Метод ConditionTree::hasConditions проверяет, что в дереве есть хотя бы одно условие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::hasConditions` проверяет, есть ли в дереве условия. Метод нужен, например, чтобы не выполнять выборку всех записей, если пользователь не задал ни одного условия.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function hasConditions()
```

## Возвращаемое значение

Метод возвращает `true`, если в дереве есть хотя бы одно условие или вложенное дерево, иначе `false`.

## Особенности

Метод не проверяет вложенные деревья. Если в дереве только пустое вложенное дерево, метод вернет `true`, хотя SQL-условие не появится. Так бывает после `whereNotIn` с пустым списком.

## Примеры

**Пример.** Код проверяет фильтр до и после добавления условия:

```php
<?php
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter();
$before = $filter->hasConditions();
$filter->whereIn('LID', []);
$afterEmptyList = $filter->hasConditions();
$filter->where('LID', 'en');

var_export([$before, $afterEmptyList, $filter->hasConditions()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => false,
  2 => true,
)
```

## Смотрите также

- [ConditionTree::getConditions](get-conditions.md)
