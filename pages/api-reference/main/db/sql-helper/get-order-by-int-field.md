---
title: Отсортировать по списку чисел SqlHelper::getOrderByIntField
description: Метод SqlHelper::getOrderByIntField возвращает выражение ORDER BY, которое ставит строки в порядке заданного списка целых чисел.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getOrderByIntField` возвращает выражение для `ORDER BY`, которое ставит строки в порядке чисел из списка. Значения метод приводит к целым числам.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getOrderByIntField(string $field, array $values, bool $quote = true): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку. При `quote = false` метод подставляет значение в SQL без экранирования |
| values\* | `array` | Задает числа в нужном порядке |
| quote | `bool` | Берет имя колонки в кавычки через [quote](quote.md), если равен `true`. По умолчанию — `true` |

## Возвращаемое значение

Метод возвращает строку `string` — выражение для `ORDER BY`.

| Реализация | Выражение |
| --- | --- |
| `SqlHelper` | Только колонка, метод не учитывает значения |
| `MysqliSqlHelper` | `FIELD(<field>, <a>, <b>, ...)` |
| `PgsqlSqlHelper` | `array_position(ARRAY[<a>, <b>, ...], <field>)` |

Ограничьте выборку значениями из списка, как в примере ниже. Положение строк с другими значениями зависит от базы данных.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | В PostgreSQL при `quote = true` подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выбирает пользователей с идентификаторами 3, 1 и 2 именно в этом порядке:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();
$ids = [3, 1, 2];

$sql = 'SELECT ID FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE ID IN (' . implode(', ', array_map('intval', $ids)) . ')'
    . ' ORDER BY ' . $helper->getOrderByIntField('ID', $ids);

print_r(array_column($connection->query($sql)->fetchAll(), 'ID'));
```

## Смотрите также

- [SqlHelper::getOrderByStringField](get-order-by-string-field.md)
