---
title: Экранировать строку SqlHelper::forSql
description: Метод SqlHelper::forSql экранирует строку для подстановки в SQL-запрос внутри одинарных кавычек.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::forSql` экранирует строку, чтобы подставить ее в SQL-запрос внутри одинарных кавычек. Кавычки метод не добавляет. Для имен таблиц и колонок используйте [quote](quote.md). Аналог в классическом API — `CDatabase::ForSql`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function forSql($value, $maxLength = 0);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает строку для экранирования |
| maxLength | `int` | Задает наибольшую длину строки в символах. Метод обрезает строку до экранирования. По умолчанию — `0`, без ограничения |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` без окружающих кавычек.

| Реализация | Функция экранирования |
| --- | --- |
| `MysqliSqlHelper` | `mysqli::real_escape_string` |
| `PgsqlSqlHelper` | `pg_escape_string` |

Обе реализации подключаются к базе данных, если подключения еще нет. Функциям экранирования нужно открытое подключение.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код ищет пользователя по логину из внешних данных. Метод экранирует логин, а код берет его в одинарные кавычки:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$login = "admin' OR '1'='1";

$id = $connection->queryScalar(
    'SELECT ID FROM ' . $helper->quote(UserTable::getTableName())
    . " WHERE LOGIN = '" . $helper->forSql($login) . "'"
);

var_dump($id);
```

## Смотрите также

- [SqlHelper::convertToDbString](convert-to-db-string.md)
- [SqlHelper::quote](quote.md)
- [Защита от SQL-инъекций](../../../../security/sql-injection.md)
