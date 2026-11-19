---
title: Отсортировать по списку строк SqlHelper::getOrderByStringField
description: Метод SqlHelper::getOrderByStringField возвращает выражение ORDER BY, которое ставит строки в порядке заданного списка строковых значений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getOrderByStringField` возвращает выражение для `ORDER BY`, которое ставит строки в порядке значений из списка. Значения метод экранирует и берет в кавычки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getOrderByStringField(string $field, array $values, bool $quote = true): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку. При `quote = false` метод подставляет значение в SQL без экранирования |
| values\* | `array` | Задает строковые значения в нужном порядке |
| quote | `bool` | Берет имя колонки в кавычки через [quote](quote.md), если равен `true`. По умолчанию — `true` |

## Возвращаемое значение

Метод возвращает строку `string` — выражение для `ORDER BY`.

| Реализация | Выражение |
| --- | --- |
| `SqlHelper` | Только колонка, метод не учитывает значения |
| `MysqliSqlHelper` | `FIELD(<field>, '<a>', '<b>', ...)` |
| `PgsqlSqlHelper` | `array_position(ARRAY['<a>', '<b>', ...], <field>)` |

Ограничьте выборку значениями из списка, как в примере ниже. Положение строк с другими значениями зависит от базы данных.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных для экранирования не удалось |

## Примеры

**Пример.** Код берет логины двух первых пользователей и выводит их в обратном порядке:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$firstLogins = array_column(
    $connection->query('SELECT LOGIN FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID', 2)->fetchAll(),
    'LOGIN'
);
$logins = array_reverse($firstLogins);

$sql = 'SELECT LOGIN FROM ' . $helper->quote(UserTable::getTableName())
    . " WHERE LOGIN IN ('" . implode("', '", array_map([$helper, 'forSql'], $logins)) . "')"
    . ' ORDER BY ' . $helper->getOrderByStringField('LOGIN', $logins);

print_r(array_column($connection->query($sql)->fetchAll(), 'LOGIN'));
```

## Смотрите также

- [SqlHelper::getOrderByIntField](get-order-by-int-field.md)
