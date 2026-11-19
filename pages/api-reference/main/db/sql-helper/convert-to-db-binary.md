---
title: Подготовить двоичные данные SqlHelper::convertToDbBinary
description: Метод SqlHelper::convertToDbBinary возвращает двоичные данные в виде, пригодном для подстановки в SQL-запрос.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbBinary` возвращает двоичные данные в виде литерала SQL, который можно подставить в запрос.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbBinary($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает двоичные данные |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` в одинарных кавычках.

| Реализация | Как кодирует данные |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | Экранирует строку через [forSql](for-sql.md) |
| `PgsqlSqlHelper` | Кодирует данные функцией `pg_escape_bytea` для колонки типа `bytea` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | В MySQL подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выводит литерал для строки с нулевым байтом:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->convertToDbBinary("kg\0m");
```

## Смотрите также

- [SqlHelper::forSql](for-sql.md)
