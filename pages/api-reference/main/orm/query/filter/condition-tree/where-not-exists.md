---
title: Добавить условие NOT EXISTS ConditionTree::whereNotExists
description: Метод ConditionTree::whereNotExists добавляет условие NOT EXISTS с подзапросом Query или SQL-выражением.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereNotExists` добавляет условие `NOT EXISTS` — подзапрос не возвращает ни одной строки. Метод нужен, например, чтобы найти записи без связанных записей.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereNotExists($query)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` или `Bitrix\Main\DB\SqlExpression` | Задает подзапрос |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргумент — не `Query` и не `SqlExpression`, например строка SQL |

## Примеры

**Пример.** Код считает пользователей без групп:

```php
<?php
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\ORM\Query\Query;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = Query::filter()->whereNotExists(
    new SqlExpression('SELECT 1 FROM b_user_group UG WHERE UG.USER_ID = ?#', 'main_user.ID')
);

echo UserTable::getCount($filter) < UserTable::getCount() ? 'filtered' : 'all users';
```

Код выведет `filtered`.

## Смотрите также

- [ConditionTree::whereExists](where-exists.md)
