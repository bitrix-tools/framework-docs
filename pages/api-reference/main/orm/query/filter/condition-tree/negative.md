---
title: Поставить NOT перед деревом ConditionTree::negative
description: Метод ConditionTree::negative ставит NOT перед всеми условиями дерева.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::negative` ставит `NOT` перед всеми условиями дерева. Например, метод превращает дерево `A AND B` в `NOT (A AND B)`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function negative($negative = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| negative | `bool` | Значение `true` включает отрицание, `false` выключает. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Если дерево пустое, отрицание не попадает в SQL, и фильтр ничего не ограничивает.

## Примеры

**Пример.** Код исключает языки, которые удовлетворяют обоим условиям:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()
    ->where(Query::filter()->negative()->where('ACTIVE', true)->where('SORT', 1));

$rows = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en`.

## Смотрите также

- [ConditionTree::whereNot](where-not.md)
- [ConditionTree::logic](logic.md)
