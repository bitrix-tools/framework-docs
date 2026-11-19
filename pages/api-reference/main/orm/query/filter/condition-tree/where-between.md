---
title: Проверить диапазон ConditionTree::whereBetween
description: Метод ConditionTree::whereBetween добавляет условие BETWEEN — значение поля в диапазоне, включая границы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereBetween` добавляет условие `BETWEEN` — значение поля лежит в диапазоне. Обе границы входят в диапазон.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereBetween($column, $valueMin, $valueMax)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| valueMin\* | `mixed` | Задает нижнюю границу, например число или объект `Bitrix\Main\Type\DateTime` |
| valueMax\* | `mixed` | Задает верхнюю границу |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

Для поля с датой и временем верхняя граница-дата без времени означает начало дня. Чтобы включить весь последний день, задайте время `23:59:59`.

## Примеры

**Пример.** Код выбирает языки с сортировкой от 2 до 10:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereBetween('SORT', 2, 10),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en`.

## Смотрите также

- [ConditionTree::whereNotBetween](where-not-between.md)
