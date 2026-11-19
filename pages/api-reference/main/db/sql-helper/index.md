---
title: SqlHelper — экранирование значений и построение SQL
description: Абстрактный класс Bitrix\Main\DB\SqlHelper экранирует значения и имена, строит SQL-выражения и запросы под тип базы данных.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `SqlHelper` экранирует значения и имена для SQL-запроса и строит SQL-выражения, которые отличаются в MySQL и PostgreSQL. Объект возвращает метод [Connection::getSqlHelper](../connection/get-sql-helper.md), создавать его конструктором не нужно. Класс абстрактный, фактический объект — реализация для типа базы данных, например [MysqliSqlHelper](../mysqli-sql-helper/index.md) или [PgsqlSqlHelper](../pgsql-sql-helper/index.md).

Многие методы класса подставляют аргументы в SQL как есть. Таблица параметров на странице метода отмечает такие аргументы. Значения, которые приходят извне, сначала экранируйте через [forSql](for-sql.md) или [convertToDbString](convert-to-db-string.md), имена — через [quote](quote.md). Для подстановки значений в шаблон запроса используйте [SqlExpression](../sql-expression/index.md).

## Методы класса

Таблицы ниже группируют методы по задачам.

### Экранирование и параметры диалекта

| Метод | Описание | С версии |
| --- | --- | --- |
| [forSql](for-sql.md) | Экранирует строку для подстановки внутри одинарных кавычек | |
| [quote](quote.md) | Берет имя таблицы или колонки в кавычки идентификатора | 14.0.0 |
| [getLeftQuote](get-left-quote.md) | Возвращает символ, которым база данных открывает имя | 14.0.0 |
| [getRightQuote](get-right-quote.md) | Возвращает символ, которым база данных закрывает имя | 14.0.0 |
| [convertToDbBinary](convert-to-db-binary.md) | Готовит двоичные данные для подстановки в запрос | |
| [convertToFullText](convert-to-full-text.md) | Готовит текст для колонки с полнотекстовым индексом | |
| [getAliasLength](get-alias-length.md) | Возвращает наибольшую длину псевдонима колонки | 14.0.0 |
| [getQueryDelimiter](get-query-delimiter.md) | Возвращает разделитель запросов в тексте с несколькими запросами | |

### SQL-функции и выражения

| Метод | Описание | С версии |
| --- | --- | --- |
| [getCurrentDateTimeFunction](get-current-date-time-function.md) | Возвращает функцию текущих даты и времени | |
| [getCurrentDateFunction](get-current-date-function.md) | Возвращает функцию текущей даты | |
| [addSecondsToDateTime](add-seconds-to-date-time.md) | Строит выражение, которое прибавляет секунды к дате | 14.0.0 |
| [addDaysToDateTime](add-days-to-date-time.md) | Строит выражение, которое прибавляет дни к дате | |
| [getDatetimeToDateFunction](get-datetime-to-date-function.md) | Строит выражение, которое отбрасывает время у даты | |
| [formatDate](format-date.md) | Переводит формат даты Битрикс в формат базы данных | 14.0.0 |
| [getCharToDateFunction](get-char-to-date-function.md) | Строит выражение даты из строки `YYYY-MM-DD HH:MI:SS` | 14.0.18 |
| [getDateToCharFunction](get-date-to-char-function.md) | Строит выражение, которое переводит дату в строку | 14.0.18 |
| [getSubstrFunction](get-substr-function.md) | Строит выражение подстроки | |
| [getConcatFunction](get-concat-function.md) | Строит выражение, которое склеивает строки | |
| [getIsNullFunction](get-is-null-function.md) | Строит выражение, которое заменяет `NULL` | |
| [getLengthFunction](get-length-function.md) | Строит выражение длины значения | |
| [castToChar](cast-to-char.md) | Строит выражение, которое приводит значение к строке | 16.0.10 |
| [softCastTextToChar](soft-cast-text-to-char.md) | Возвращает выражение текстовой колонки для группировки и сортировки | 16.5.7 |
| [getRandomFunction](get-random-function.md) | Возвращает функцию случайного числа | |
| [getSha1Function](get-sha1-function.md) | Строит выражение хеша SHA-1 | |
| [getRegexpOperator](get-regexp-operator.md) | Строит условие проверки по регулярному выражению | |
| [getIlikeOperator](get-ilike-operator.md) | Строит условие `LIKE` без учета регистра | |
| [getAscendingOrder](get-ascending-order.md) | Возвращает указание сортировки по возрастанию | 14.5.0 |
| [getDescendingOrder](get-descending-order.md) | Возвращает указание сортировки по убыванию | 14.5.0 |
| [getOrderByStringField](get-order-by-string-field.md) | Строит сортировку в порядке списка строк | |
| [getOrderByIntField](get-order-by-int-field.md) | Строит сортировку в порядке списка чисел | |
| [getConditionalAssignment](get-conditional-assignment.md) | Строит присваивание с проверкой хеша текущего значения | |
| [initRowNumber](init-row-number.md) | Возвращает запрос, который готовит нумерацию строк | |
| [getRowNumber](get-row-number.md) | Строит выражение номера строки | |
| [getMatchFunction](get-match-function.md) | Строит условие полнотекстового поиска | |
| [getMatchAndExpression](get-match-and-expression.md) | Собирает строку поиска всех слов | |
| [getMatchOrExpression](get-match-or-expression.md) | Собирает строку поиска любого слова | |
| [values](values.md) | Возвращает ссылку на значение колонки из добавляемой строки | |

### Построение запросов

| Метод | Описание | С версии |
| --- | --- | --- |
| [getTopSql](get-top-sql.md) | Добавляет к запросу ограничение по числу строк и смещение | 14.0.0 |
| [prepareInsert](prepare-insert.md) | Готовит колонки и значения для `INSERT` | |
| [prepareUpdate](prepare-update.md) | Готовит присваивания для `UPDATE` | |
| [prepareAssignment](prepare-assignment.md) | Готовит присваивание одной колонки | 14.0.0 |
| [prepareMerge](prepare-merge.md) | Строит вставку строки с обновлением при совпадении ключа | 15.5.0 |
| [prepareMergeMultiple](prepare-merge-multiple.md) | Строит вставку нескольких строк с заменой при совпадении ключа | |
| [prepareMergeSelect](prepare-merge-select.md) | Строит вставку из выборки с обновлением при совпадении ключа | |
| [prepareMergeValues](prepare-merge-values.md) | Строит вставку нескольких строк с обновлением при совпадении ключа | |
| [prepareDeleteLimit](prepare-delete-limit.md) | Строит удаление с ограничением по числу строк | |
| [prepareCorrelatedUpdate](prepare-correlated-update.md) | Строит обновление со значениями из других таблиц | |
| [getInsertIgnore](get-insert-ignore.md) | Строит вставку, которая пропускает строки с существующим ключом | |
| [getQueryTables](get-query-tables.md) | Возвращает имена таблиц из текста запроса | |

### Преобразование значений

| Метод | Описание | С версии |
| --- | --- | --- |
| [convertToDb](convert-to-db.md) | Преобразует значение в литерал SQL по типу поля ORM | 14.5.2 |
| [convertFromDb](convert-from-db.md) | Преобразует значение из базы данных по типу поля ORM | 14.5.2 |
| [convertToDbInteger](convert-to-db-integer.md) | Приводит значение к целому числу в пределах колонки | |
| [convertFromDbInteger](convert-from-db-integer.md) | Приводит значение из базы данных к целому числу | |
| [convertToDbFloat](convert-to-db-float.md) | Приводит значение к дробному числу для SQL | |
| [convertFromDbFloat](convert-from-db-float.md) | Приводит значение из базы данных к дробному числу | |
| [convertToDbString](convert-to-db-string.md) | Экранирует строку и берет ее в кавычки | |
| [convertFromDbString](convert-from-db-string.md) | Приводит значение из базы данных к строке | |
| [convertToDbText](convert-to-db-text.md) | Экранирует текст и берет его в кавычки | |
| [convertFromDbText](convert-from-db-text.md) | Приводит значение текстовой колонки к строке | |
| [convertToDbDate](convert-to-db-date.md) | Превращает объект даты в литерал SQL | |
| [convertFromDbDate](convert-from-db-date.md) | Превращает дату из базы данных в объект `Date` | |
| [convertToDbDateTime](convert-to-db-date-time.md) | Превращает объект даты и времени в литерал SQL | |
| [convertFromDbDateTime](convert-from-db-date-time.md) | Превращает дату и время из базы данных в объект `DateTime` | |
| [getConverter](get-converter.md) | Возвращает функцию преобразования значения колонки при выборке | 15.0.1 |

### Типы колонок

| Метод | Описание | С версии |
| --- | --- | --- |
| [getColumnTypeByField](get-column-type-by-field.md) | Возвращает тип колонки для поля ORM | 14.5.2 |
| [getFieldByColumnType](get-field-by-column-type.md) | Создает поле ORM по типу колонки | 14.5.2 |
| [isBigType](is-big-type.md) | Проверяет, относится ли тип колонки к большим | |

## Наследование

### Реализации

| Класс | Тип базы данных | Собственные методы |
| --- | --- | --- |
| [MysqliSqlHelper](../mysqli-sql-helper/index.md) | MySQL | Нет |
| [PgsqlSqlHelper](../pgsql-sql-helper/index.md) | PostgreSQL | Нет |

### Что реализовать в наследнике

Наследник реализует абстрактные методы [getAliasLength](get-alias-length.md), [getQueryDelimiter](get-query-delimiter.md), [forSql](for-sql.md), [getCurrentDateTimeFunction](get-current-date-time-function.md), [getCurrentDateFunction](get-current-date-function.md), [addSecondsToDateTime](add-seconds-to-date-time.md), [getDatetimeToDateFunction](get-datetime-to-date-function.md), [formatDate](format-date.md), [getConcatFunction](get-concat-function.md), [getIsNullFunction](get-is-null-function.md), [getLengthFunction](get-length-function.md), [getCharToDateFunction](get-char-to-date-function.md), [getDateToCharFunction](get-date-to-char-function.md), [castToChar](cast-to-char.md), [softCastTextToChar](soft-cast-text-to-char.md), [getTopSql](get-top-sql.md), [prepareMerge](prepare-merge.md), [getColumnTypeByField](get-column-type-by-field.md) и [getFieldByColumnType](get-field-by-column-type.md).

Еще 14 методов базовый класс объявляет обычными, но они выбрасывают `NotImplementedException`. Наследник переопределяет их, если код использует эти возможности. Это [addDaysToDateTime](add-days-to-date-time.md), [getInsertIgnore](get-insert-ignore.md), [getRegexpOperator](get-regexp-operator.md), [getIlikeOperator](get-ilike-operator.md), [values](values.md), [getMatchFunction](get-match-function.md), [getMatchAndExpression](get-match-and-expression.md), [getMatchOrExpression](get-match-or-expression.md), [prepareMergeMultiple](prepare-merge-multiple.md), [prepareMergeSelect](prepare-merge-select.md), [prepareDeleteLimit](prepare-delete-limit.md), [initRowNumber](init-row-number.md), [getRowNumber](get-row-number.md) и [prepareCorrelatedUpdate](prepare-correlated-update.md).

## Смотрите также

- [SqlHelper и SqlExpression](../../../../database/sql-helper-and-expression.md)
- [Защита от SQL-инъекций](../../../../security/sql-injection.md)
- [Connection](../connection/index.md)
