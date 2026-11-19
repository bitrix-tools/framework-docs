---
title: Проверить выход за диапазон ConditionTree::whereNotBetween
description: Метод ConditionTree::whereNotBetween добавляет условие NOT BETWEEN — значение поля вне диапазона.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNotBetween` добавляет условие `NOT ... BETWEEN` — значение поля лежит вне диапазона.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotBetween($column, $valueMin, $valueMax)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| valueMin\* | `mixed` | Задает нижнюю границу |
| valueMax\* | `mixed` | Задает верхнюю границу |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Примеры

**Пример.** Код выбирает языки с сортировкой вне диапазона от 2 до 10:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereNotBetween('SORT', 2, 10),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru`.

## Смотрите также

- [ConditionTree::whereBetween](where-between.md)
