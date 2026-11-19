---
title: Добавить условие с отрицанием ConditionTree::whereNot
description: Метод ConditionTree::whereNot добавляет условие или вложенный фильтр с отрицанием NOT.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNot` добавляет условие с отрицанием `NOT`. Метод принимает те же аргументы, что [where](where.md), помещает условие во вложенный фильтр и ставит перед ним `NOT`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNot(...$filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `mixed` | Задает условие в формах метода `where` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргументы неверные. Случаи те же, что у `where` |

## Примеры

**Пример.** Код выбирает языки, кроме английского:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereNot('LID', 'en'),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru`.

## Смотрите также

- [ConditionTree::where](where.md)
- [ConditionTree::negative](negative.md)
