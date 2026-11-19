---
title: MysqliSqlHelper — SQL для MySQL
description: Класс Bitrix\Main\DB\MysqliSqlHelper реализует экранирование и SQL-выражения SqlHelper для MySQL.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `MysqliSqlHelper` — реализация [SqlHelper](../sql-helper/index.md) для MySQL. Объект возвращает метод `getSqlHelper` соединения [MysqliConnection](../mysqli-connection/index.md), создавать его конструктором не нужно.

Класс [SqlHelper](../sql-helper/index.md) описывает все методы, которые вызывает код приложения. Собственных методов у класса нет.

## Наследование

Класс наследует [SqlHelper](../sql-helper/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| [getLeftQuote](../sql-helper/get-left-quote.md), [getRightQuote](../sql-helper/get-right-quote.md) | Возвращают обратную кавычку `` ` `` |
| [getAliasLength](../sql-helper/get-alias-length.md) | Возвращает `256` |
| [getQueryDelimiter](../sql-helper/get-query-delimiter.md) | Возвращает `;` |
| [forSql](../sql-helper/for-sql.md) | Экранирует строку методом `mysqli::real_escape_string`. Подключается к базе данных, если подключения еще нет |
| [getCurrentDateTimeFunction](../sql-helper/get-current-date-time-function.md) | Возвращает `NOW()` |
| [getCurrentDateFunction](../sql-helper/get-current-date-function.md) | Возвращает `CURDATE()` |
| [addSecondsToDateTime](../sql-helper/add-seconds-to-date-time.md) | Строит `DATE_ADD(<from>, INTERVAL <seconds> SECOND)` |
| [addDaysToDateTime](../sql-helper/add-days-to-date-time.md) | Строит `DATE_ADD(<from>, INTERVAL <days> DAY)` |
| [getDatetimeToDateFunction](../sql-helper/get-datetime-to-date-function.md) | Строит `DATE(<value>)` |
| [formatDate](../sql-helper/format-date.md) | Переводит формат в обозначения `DATE_FORMAT`, например `YYYY` в `%Y` |
| [getConcatFunction](../sql-helper/get-concat-function.md) | Строит `CONCAT(...)`. Без аргументов возвращает пустую строку |
| [getIsNullFunction](../sql-helper/get-is-null-function.md) | Строит `IFNULL(...)` |
| [getLengthFunction](../sql-helper/get-length-function.md) | Строит `LENGTH(...)` |
| [getCharToDateFunction](../sql-helper/get-char-to-date-function.md) | Возвращает дату в одинарных кавычках |
| [getDateToCharFunction](../sql-helper/get-date-to-char-function.md) | Возвращает колонку без изменений |
| [castToChar](../sql-helper/cast-to-char.md) | Строит `CAST(<fieldName> AS char)` |
| [softCastTextToChar](../sql-helper/soft-cast-text-to-char.md) | Возвращает колонку без изменений |
| [getConverter](../sql-helper/get-converter.md) | Возвращает функции преобразования для полей даты и даты и времени |
| [convertFromDbDate](../sql-helper/convert-from-db-date.md) | Разбирает дату в формате `Y-m-d`. Для `null` и `0000-00-00` возвращает `null` |
| [convertFromDbDateTime](../sql-helper/convert-from-db-date-time.md) | Разбирает дату и время в формате `Y-m-d H:i:s`. Для `null` и `0000-00-00 00:00:00` возвращает `null` |
| [getColumnTypeByField](../sql-helper/get-column-type-by-field.md) | Использует типы `int`, `bigint`, `double`, `datetime`, `longtext` и другие типы MySQL |
| [getFieldByColumnType](../sql-helper/get-field-by-column-type.md) | Принимает константы `MYSQLI_TYPE_*` |
| [getTopSql](../sql-helper/get-top-sql.md) | Добавляет `LIMIT <offset>, <limit>` |
| [prepareMerge](../sql-helper/prepare-merge.md) | Строит `INSERT ... ON DUPLICATE KEY UPDATE`. Не использует `primaryFields` |
| [prepareMergeMultiple](../sql-helper/prepare-merge-multiple.md) | Строит `REPLACE INTO` |
| [prepareMergeSelect](../sql-helper/prepare-merge-select.md) | Строит `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE` |
| [prepareDeleteLimit](../sql-helper/prepare-delete-limit.md) | Строит `DELETE ... ORDER BY ... LIMIT` |
| [prepareCorrelatedUpdate](../sql-helper/prepare-correlated-update.md) | Строит `UPDATE <таблица> AS <псевдоним>, <другие таблицы> SET ...` |
| [getInsertIgnore](../sql-helper/get-insert-ignore.md) | Строит `INSERT IGNORE INTO` |
| [getRegexpOperator](../sql-helper/get-regexp-operator.md) | Строит `<field> regexp <regexp>` |
| [getIlikeOperator](../sql-helper/get-ilike-operator.md) | Строит `<field> LIKE <value>` |
| [values](../sql-helper/values.md) | Строит `` VALUES(`<колонка>`) `` |
| [getMatchFunction](../sql-helper/get-match-function.md) | Строит `MATCH (...) AGAINST (... IN BOOLEAN MODE)` |
| [getMatchAndExpression](../sql-helper/get-match-and-expression.md) | Собирает `+a +b`, для поиска по началу — `+a* +b*` |
| [getMatchOrExpression](../sql-helper/get-match-or-expression.md) | Собирает `a b`, для поиска по началу — `a* b*` |
| [initRowNumber](../sql-helper/init-row-number.md) | Возвращает `set @<имя> = 0` |
| [getRowNumber](../sql-helper/get-row-number.md) | Строит `@<имя>:=@<имя> + 1` |
| [isBigType](../sql-helper/is-big-type.md) | Считает большими типы `BLOB` и `JSON` |
| [getOrderByStringField](../sql-helper/get-order-by-string-field.md), [getOrderByIntField](../sql-helper/get-order-by-int-field.md) | Строят выражение `FIELD(...)` через переопределенный защищенный метод `getOrderByField` |

### Унаследованные методы

Остальные методы работают как в классе [SqlHelper](../sql-helper/index.md#методы-класса).

## Смотрите также

- [SqlHelper](../sql-helper/index.md)
- [PgsqlSqlHelper](../pgsql-sql-helper/index.md)
- [MysqliConnection](../mysqli-connection/index.md)
