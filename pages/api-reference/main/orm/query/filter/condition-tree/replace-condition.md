---
title: Заменить условие ConditionTree::replaceCondition
description: Метод ConditionTree::replaceCondition заменяет условие дерева другим условием. Метод ищет тот же объект условия.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::replaceCondition` заменяет условие первого уровня другим условием. Метод нужен, чтобы изменить фильтр, который собрал другой код, например обработчик события.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function replaceCondition($currentCondition, $newCondition)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| currentCondition\* | `Condition` или `ConditionTree` | Задает условие, которое нужно заменить. Метод ищет тот же объект, сравнивая через `===` |
| newCondition\* | `Condition` или `ConditionTree` | Задает новое условие |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если нашел и заменил условие, иначе `false`.

## Особенности

Метод ищет только среди условий первого уровня и не просматривает вложенные деревья. Метод не проверяет новое условие.

## Примеры

**Пример.** Код заменяет условие на код языка:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Filter\Condition;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->where('LID', 'en');
$current = $filter->getConditions()[0];

$replaced = $filter->replaceCondition($current, new Condition('LID', '=', 'ru'));
$rows = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter])->fetchAll();

echo var_export($replaced, true) . ' ' . $rows[0]['LID'];
```

Код выведет `true ru`.

## Смотрите также

- [ConditionTree::removeCondition](remove-condition.md)
- [ConditionTree::getConditions](get-conditions.md)
