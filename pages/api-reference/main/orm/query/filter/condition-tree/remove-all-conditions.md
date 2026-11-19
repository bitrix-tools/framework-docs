---
title: Удалить все условия ConditionTree::removeAllConditions
description: Метод ConditionTree::removeAllConditions удаляет все условия и вложенные деревья и сохраняет логику и отрицание дерева.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::removeAllConditions` удаляет все условия и вложенные деревья. Метод не меняет логику [logic](logic.md) и отрицание [negative](negative.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function removeAllConditions()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код очищает фильтр и проверяет логику:

```php
<?php
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->logic('or')->where('LID', 'en')->where('LID', 'ru');
$filter->removeAllConditions();

echo var_export($filter->hasConditions(), true) . ' ' . $filter->logic();
```

Код выведет `false or`.

## Смотрите также

- [ConditionTree::removeCondition](remove-condition.md)
