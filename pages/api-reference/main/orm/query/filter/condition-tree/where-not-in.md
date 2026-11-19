---
title: Проверить отсутствие в списке ConditionTree::whereNotIn
description: Метод ConditionTree::whereNotIn добавляет условие NOT IN. Пустой список не ограничивает выборку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNotIn` добавляет условие `NOT ... IN` — значение поля не входит в список. Метод принимает те же значения, что [whereIn](where-in.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotIn($column, $values)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| values\* | `array`, `Bitrix\Main\ORM\Query\Query` или `Bitrix\Main\DB\SqlExpression` | Задает список значений или подзапрос |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

- Если список пустой, метод добавляет пустое вложенное дерево. В SQL условие не попадает, и запрос вернет все записи — для `NOT IN` это ожидаемый результат.
- Условие `NOT IN` не находит записи, у которых поле равно `NULL`.

## Примеры

**Пример.** Код выбирает языки, кроме перечисленных:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereNotIn('LID', ['en', 'de']),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru`.

## Смотрите также

- [ConditionTree::whereIn](where-in.md)
