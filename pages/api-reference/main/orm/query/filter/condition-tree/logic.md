---
title: Задать логику объединения ConditionTree::logic
description: Метод ConditionTree::logic задает, как объединять условия дерева — через AND или OR, а без аргумента возвращает текущую логику.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::logic` задает логику объединения условий дерева — `and` или `or`. Без аргумента метод возвращает текущую логику. Логика действует только на условия этого дерева. Вложенное дерево объединяет свои условия по своей логике.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function logic($logic = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| logic | `string` или `null` | Задает логику — `'and'`, `'or'` или константы `ConditionTree::LOGIC_AND` и `ConditionTree::LOGIC_OR`. Регистр не важен. По умолчанию — `null`, метод возвращает текущую логику |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

С аргументом метод возвращает тот же объект `ConditionTree`. Без аргумента метод возвращает строку `'and'` или `'or'`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Логика не `and` и не `or` |

## Примеры

**Пример.** Код выбирает активные языки, у которых код `en` или сортировка 1:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()
    ->where('ACTIVE', true)
    ->where(
        Query::filter()
            ->logic('or')
            ->where('LID', 'en')
            ->where('SORT', 1)
    );

$rows = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter, 'order' => ['LID' => 'ASC']])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en,ru`.

## Смотрите также

- [ConditionTree::negative](negative.md)
- [ConditionTree::where](where.md)
