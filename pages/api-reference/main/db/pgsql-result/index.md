---
title: PgsqlResult — результат запроса PostgreSQL
description: Класс Bitrix\Main\DB\PgsqlResult реализует результат запроса для PostgreSQL. Класс приводит ключи строк к верхнему регистру.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `PgsqlResult` — реализация [Result](../result/index.md) для PostgreSQL. Объект возвращает метод [query](../connection/query.md) соединения `PgsqlConnection`, создавать его конструктором не нужно.

Класс [Result](../result/index.md) описывает все методы, которые вызывает код приложения. Собственных методов у класса нет.

Класс приводит имена колонок к верхнему регистру. Запрос `SELECT id, login FROM ...` вернет строку с ключами `ID` и `LOGIN`. Значения колонок типа `bytea` класс раскодирует функцией `pg_unescape_bytea` при каждой выборке строки.

## Наследование

Класс наследует [Result](../result/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| [getSelectedRowsCount](../result/get-selected-rows-count.md) | Возвращает результат функции `pg_num_rows` |
| [getFieldsCount](../result/get-fields-count.md) | Возвращает результат функции `pg_num_fields` |
| [getFields](../result/get-fields.md) | Строит объекты полей по типам колонок PostgreSQL. Приводит имена колонок к верхнему регистру |

### Унаследованные методы

Методы чтения строк, преобразования значений и общего числа строк работают как в классе [Result](../result/index.md#методы-класса). Методы [getLength](../result/get-length.md) и [hasBigFields](../result/has-big-fields.md) работают как в базовом классе и возвращают `0` и `false`.

## Смотрите также

- [Result](../result/index.md)
- [MysqliResult](../mysqli-result/index.md)
- [PgsqlConnection](../pgsql-connection/index.md)
