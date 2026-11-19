---
title: PgsqlSqlHelper — SQL для PostgreSQL
description: Класс Bitrix\Main\DB\PgsqlSqlHelper реализует экранирование и SQL-выражения SqlHelper для PostgreSQL.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `PgsqlSqlHelper` — реализация [SqlHelper](../sql-helper/index.md) для PostgreSQL. Объект возвращает метод `getSqlHelper` соединения [PgsqlConnection](../pgsql-connection/index.md), создавать его конструктором не нужно.

Класс [SqlHelper](../sql-helper/index.md) описывает все методы, которые вызывает код приложения. Собственных методов у класса нет.

## Наследование

Класс наследует [SqlHelper](../sql-helper/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| [getLeftQuote](../sql-helper/get-left-quote.md), [getRightQuote](../sql-helper/get-right-quote.md) | Возвращают двойную кавычку `"` |
| [getAliasLength](../sql-helper/get-alias-length.md) | Возвращает `63` |
| [quote](../sql-helper/quote.md) | Приводит имя к нижнему регистру и экранирует его целиком функцией `pg_escape_identifier`. Точку не считает разделителем. Подключается к базе данных, если подключения еще нет |
| [values](../sql-helper/values.md) | Строит `EXCLUDED."<колонка>"` с именем колонки в нижнем регистре |
| [getQueryDelimiter](../sql-helper/get-query-delimiter.md) | Возвращает `;` |
| [forSql](../sql-helper/for-sql.md) | Экранирует строку функцией `pg_escape_string`. Подключается к базе данных, если подключения еще нет |
| [convertToDbBinary](../sql-helper/convert-to-db-binary.md) | Кодирует данные функцией `pg_escape_bytea` |
| [convertToFullText](../sql-helper/convert-to-full-text.md) | Строит вызов `safe_text_for_tsvector('...')` и обрезает текст до значения константы `FULLTEXT_MAXIMUM_LENGTH` — 1 000 000 символов |
| [getCurrentDateTimeFunction](../sql-helper/get-current-date-time-function.md) | Возвращает `now()` |
| [getCurrentDateFunction](../sql-helper/get-current-date-function.md) | Возвращает `current_date` |
| [addSecondsToDateTime](../sql-helper/add-seconds-to-date-time.md) | Строит `<from>::timestamp + cast(<seconds>\|\|' second' as interval)`. Без `from` — `now() + cast(...)` |
| [addDaysToDateTime](../sql-helper/add-days-to-date-time.md) | Строит `(<from>::timestamp + cast(<days>\|\|' day' as interval))`. Без `from` — `(now() + cast(...))` |
| [getDatetimeToDateFunction](../sql-helper/get-datetime-to-date-function.md) | Строит `cast(<value> as date)` |
| [formatDate](../sql-helper/format-date.md) | Переводит формат в обозначения `to_char`, например `HH` в `HH24` |
| [getRegexpOperator](../sql-helper/get-regexp-operator.md) | Строит `<field> ~ <regexp>` |
| [getIlikeOperator](../sql-helper/get-ilike-operator.md) | Строит `<field> ILIKE <value>` |
| [getConcatFunction](../sql-helper/get-concat-function.md) | Склеивает аргументы оператором `\|\|`. Без аргументов возвращает пустую строку |
| [getRandomFunction](../sql-helper/get-random-function.md) | Возвращает `random()` |
| [getSha1Function](../sql-helper/get-sha1-function.md) | Строит `encode(digest(...), 'hex')` |
| [getIsNullFunction](../sql-helper/get-is-null-function.md) | Строит `COALESCE(...)` |
| [getLengthFunction](../sql-helper/get-length-function.md) | Строит `OCTET_LENGTH(...)` |
| [getMatchFunction](../sql-helper/get-match-function.md) | Строит `to_tsvector(...) @@ to_tsquery(...)` с конфигурацией `english` |
| [getMatchAndExpression](../sql-helper/get-match-and-expression.md) | Собирает `a & b`, для поиска по началу — `a:* & b:*` |
| [getMatchOrExpression](../sql-helper/get-match-or-expression.md) | Собирает `a \| b`, для поиска по началу — `a:* \| b:*` |
| [getCharToDateFunction](../sql-helper/get-char-to-date-function.md) | Строит `timestamp '<value>'` |
| [getDateToCharFunction](../sql-helper/get-date-to-char-function.md) | Строит `TO_CHAR(<fieldName>, 'YYYY-MM-DD HH24:MI:SS')` |
| [getConverter](../sql-helper/get-converter.md) | Возвращает функции преобразования для полей даты и даты и времени |
| [convertFromDbDate](../sql-helper/convert-from-db-date.md) | Разбирает дату в формате `Y-m-d`. Для `null` и `0000-00-00` возвращает `null` |
| [convertFromDbDateTime](../sql-helper/convert-from-db-date-time.md) | Разбирает дату и время в формате `Y-m-d H:i:s`. Для `null` и `0000-00-00 00:00:00` возвращает `null` |
| [castToChar](../sql-helper/cast-to-char.md) | Строит `CAST(<fieldName> AS varchar)` |
| [softCastTextToChar](../sql-helper/soft-cast-text-to-char.md) | Возвращает колонку без изменений |
| [getColumnTypeByField](../sql-helper/get-column-type-by-field.md) | Использует типы `integer`, `float8`, `timestamp`, `text` и другие типы PostgreSQL |
| [getFieldByColumnType](../sql-helper/get-field-by-column-type.md) | Принимает имена типов PostgreSQL. Для `bytea` создает строковое поле с признаком двоичных данных |
| [getTopSql](../sql-helper/get-top-sql.md) | Добавляет `LIMIT <limit> OFFSET <offset>` |
| [getInsertIgnore](../sql-helper/get-insert-ignore.md) | Строит `INSERT ... ON CONFLICT DO NOTHING` |
| [getAscendingOrder](../sql-helper/get-ascending-order.md) | Возвращает `ASC NULLS FIRST` |
| [getDescendingOrder](../sql-helper/get-descending-order.md) | Возвращает `DESC NULLS LAST` |
| [prepareMerge](../sql-helper/prepare-merge.md) | Строит `INSERT ... ON CONFLICT (...) DO UPDATE SET`. Требует непустой `primaryFields` |
| [prepareMergeMultiple](../sql-helper/prepare-merge-multiple.md) | Строит `INSERT ... ON CONFLICT (...) DO UPDATE SET (...) = (EXCLUDED....)` |
| [prepareMergeSelect](../sql-helper/prepare-merge-select.md) | Строит `INSERT ... SELECT ... ON CONFLICT (...) DO UPDATE SET` |
| [prepareDeleteLimit](../sql-helper/prepare-delete-limit.md) | Удаляет строки по первичному ключу из подзапроса с `LIMIT` |
| [initRowNumber](../sql-helper/init-row-number.md) | Возвращает пустую строку |
| [getRowNumber](../sql-helper/get-row-number.md) | Возвращает `row_number() over()` |
| [prepareCorrelatedUpdate](../sql-helper/prepare-correlated-update.md) | Строит `UPDATE ... SET ... FROM ... WHERE` |
| [getOrderByStringField](../sql-helper/get-order-by-string-field.md), [getOrderByIntField](../sql-helper/get-order-by-int-field.md) | Строят выражение `array_position(ARRAY[...], ...)` через переопределенный защищенный метод `getOrderByField` |

### Унаследованные методы

Остальные методы работают как в классе [SqlHelper](../sql-helper/index.md#методы-класса).

## Смотрите также

- [SqlHelper](../sql-helper/index.md)
- [MysqliSqlHelper](../mysqli-sql-helper/index.md)
- [PgsqlConnection](../pgsql-connection/index.md)
