---
title: Добавить готовое условие ConditionTree::addCondition
description: Метод ConditionTree::addCondition добавляет готовый объект условия Condition или вложенное дерево ConditionTree.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::addCondition` добавляет готовое условие `Bitrix\Main\ORM\Query\Filter\Condition` или вложенное дерево. В отличие от [where](where.md), метод не проверяет оператор условия.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function addCondition($condition)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| condition\* | `Bitrix\Main\ORM\Query\Filter\Condition` или `ConditionTree` | Задает условие. Конструктор `Condition` принимает поле, оператор и значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргумент — не `Condition` и не `ConditionTree` |

## Примеры

**Пример.** Код переносит условие из одного фильтра в другой:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Filter\Condition;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->addCondition(new Condition('LID', '=', 'ru'));

$rows = LanguageTable::getList(['select' => ['NAME'], 'filter' => $filter])->fetchAll();

echo $rows[0]['NAME'];
```

Код выведет `Russian`.

## Смотрите также

- [ConditionTree::where](where.md)
- [ConditionTree::replaceCondition](replace-condition.md)
