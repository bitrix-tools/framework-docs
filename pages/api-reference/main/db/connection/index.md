---
title: Connection — соединение с базой данных
description: Абстрактный класс Bitrix\Main\DB\Connection выполняет SQL-запросы, управляет транзакциями и структурой таблиц.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.9

{% endnote %}

## Когда использовать

Класс `Connection` описывает соединение с базой данных. Объект соединения возвращает `Application::getConnection()`, создавать его конструктором не нужно. Класс абстрактный, фактический объект — реализация для типа базы данных, например `MysqliConnection` или `PgsqlConnection`.

К соединению обращаются, когда нужен SQL-запрос напрямую, транзакция, именованная блокировка или изменение структуры таблицы. Для чтения и записи данных ORM-классов используйте методы `DataManager`. Значения для SQL экранируйте через объект, который возвращает [getSqlHelper](get-sql-helper.md).

Аналог в классическом API — глобальный объект `$DB` класса `CDatabase`.

## Методы класса

Таблицы ниже группируют методы по задачам.

### Параметры соединения

| Метод | Описание | С версии |
| --- | --- | --- |
| [getHost](get-host.md) | Возвращает адрес сервера базы данных из настроек соединения | |
| [getLogin](get-login.md) | Возвращает имя пользователя базы данных из настроек соединения | |
| [getDatabase](get-database.md) | Возвращает имя базы данных из настроек соединения | |
| [isDeferred](is-deferred.md) | Проверяет, откладывает ли соединение подключение до первого запроса | |
| [isPersistent](is-persistent.md) | Проверяет, использует ли соединение постоянное подключение | |
| [isUtf8mb4](is-utf8mb4.md) | Проверяет, включена ли в настройках соединения кодировка `utf8mb4` для таблицы или колонки | |
| [setNodeId](set-node-id.md) | Задает идентификатор узла кластера для соединения | 15.0.1 |
| [getNodeId](get-node-id.md) | Возвращает идентификатор узла кластера | 15.0.1 |
| [getType](get-type.md) | Возвращает тип базы данных | 14.0.0 |
| [getVersion](get-version.md) | Возвращает версию сервера базы данных | 14.0.0 |
| [getSqlHelper](get-sql-helper.md) | Возвращает объект для экранирования значений и построения SQL под тип базы данных | 14.0.0 |

### Выполнение запросов

| Метод | Описание | С версии |
| --- | --- | --- |
| [query](query.md) | Выполняет SQL-запрос и возвращает результат | 14.0.0 |
| [queryScalar](query-scalar.md) | Выполняет запрос и возвращает значение первой колонки первой строки | 14.0.0 |
| [queryExecute](query-execute.md) | Выполняет запрос без возврата результата | 14.0.0 |
| [executeSqlBatch](execute-sql-batch.md) | Выполняет несколько запросов из одного текста и возвращает ошибки | 14.0.0 |
| [parseSqlBatch](parse-sql-batch.md) | Разбивает текст с несколькими запросами на отдельные запросы | |
| [getAffectedRowsCount](get-affected-rows-count.md) | Возвращает число строк, которые изменил последний запрос | 14.0.0 |
| [getErrorMessage](get-error-message.md) | Возвращает сообщение об ошибке последней операции с базой данных | |
| [getErrorCode](get-error-code.md) | Возвращает код ошибки последней операции с базой данных | |
| [disableQueryExecuting](disable-query-executing.md) | Отключает выполнение запросов и включает сбор их текста | 14.5.1 |
| [enableQueryExecuting](enable-query-executing.md) | Снова включает выполнение запросов | 14.5.1 |
| [isQueryExecutingEnabled](is-query-executing-enabled.md) | Проверяет, выполняет ли соединение запросы | |
| [getDisabledQueryExecutingDump](get-disabled-query-executing-dump.md) | Возвращает собранные запросы и очищает список | 14.5.1 |

### Добавление строк

| Метод | Описание | С версии |
| --- | --- | --- |
| [add](add.md) | Добавляет строку в таблицу и возвращает ее идентификатор | 14.0.0 |
| [addMulti](add-multi.md) | Добавляет несколько строк одним запросом | |
| [getInsertedId](get-inserted-id.md) | Возвращает идентификатор последней добавленной строки | |

### Структура таблиц

| Метод | Описание | С версии |
| --- | --- | --- |
| [isTableExists](is-table-exists.md) | Проверяет, есть ли таблица в базе данных | 14.0.0 |
| [getTableFields](get-table-fields.md) | Возвращает описание колонок таблицы объектами полей ORM | 14.0.0 |
| [getTableField](get-table-field.md) | Возвращает описание одной колонки таблицы | 14.0.0 |
| [createTable](create-table.md) | Создает таблицу по описанию полей ORM | |
| [renameTable](rename-table.md) | Переименовывает таблицу | 14.0.4 |
| [truncateTable](truncate-table.md) | Удаляет все строки таблицы | 15.0.4 |
| [dropTable](drop-table.md) | Удаляет таблицу | 14.5.1 |
| [dropColumn](drop-column.md) | Удаляет колонку таблицы | 14.5.1 |
| [isIndexExists](is-index-exists.md) | Проверяет, есть ли индекс по колонкам | 14.0.0 |
| [getIndexName](get-index-name.md) | Возвращает имя индекса по колонкам | 14.0.0 |
| [createIndex](create-index.md) | Создает индекс | 14.9.4 |
| [createPrimaryIndex](create-primary-index.md) | Создает первичный ключ таблицы | 14.5.1 |
| [clearCaches](clear-caches.md) | Очищает кеш описания колонок | 14.0.0 |

### Транзакции и блокировки

| Метод | Описание | С версии |
| --- | --- | --- |
| [startTransaction](start-transaction.md) | Начинает транзакцию или создает точку сохранения во вложенной транзакции | 14.0.0 |
| [commitTransaction](commit-transaction.md) | Фиксирует транзакцию | 14.0.0 |
| [rollbackTransaction](rollback-transaction.md) | Откатывает транзакцию | 14.0.0 |
| [lock](lock.md) | Устанавливает именованную блокировку | |
| [unlock](unlock.md) | Снимает именованную блокировку | |

### Отслеживание запросов

| Метод | Описание | С версии |
| --- | --- | --- |
| [startTracker](start-tracker.md) | Включает сбор сведений о запросах | 14.0.0 |
| [stopTracker](stop-tracker.md) | Выключает сбор сведений о запросах | 14.0.0 |
| [getTracker](get-tracker.md) | Возвращает объект со сведениями о запросах | 14.0.0 |
| [setTracker](set-tracker.md) | Задает объект для сбора сведений о запросах | 14.9.4 |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `PERSISTENT` | `1` | Флаг постоянного подключения в ключе `options` настроек соединения |
| `DEFERRED` | `2` | Флаг отложенного подключения в ключе `options` настроек соединения |
| `INDEX_UNIQUE` | `'UNIQUE'` | Тип уникального индекса для `createIndex` |
| `INDEX_FULLTEXT` | `'FULLTEXT'` | Тип полнотекстового индекса для `createIndex` |
| `INDEX_SPATIAL` | `'SPATIAL'` | Тип пространственного индекса для `createIndex`. В PostgreSQL метод создает обычный индекс |

## Наследование

Класс `Connection` наследует абстрактный класс `Bitrix\Main\Data\Connection`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `connect` | Не подключается к базе данных, если подключение отложенное. Отложенное подключение открывается при первом запросе |
| `disconnect` | Не закрывает постоянное подключение |

### Унаследованные методы

Методы `getResource`, `isConnected` и `getConfiguration` работают как в классе `Bitrix\Main\Data\Connection`. Метод `getResource` подключается к базе данных, если подключения еще нет.

Метод `getMaxAllowedPacket` работает как в базовом классе только в `PgsqlConnection` и возвращает `PHP_INT_MAX`. В MySQL метод читает переменную сервера `max_allowed_packet` и запоминает значение.

### Реализации

Реализация для MySQL состоит из двух классов. Промежуточный абстрактный класс `MysqlCommonConnection` содержит общую логику MySQL, класс `MysqliConnection` наследует его и работает через расширение `mysqli`.

| Класс | Тип базы данных | Собственные методы |
| --- | --- | --- |
| [MysqliConnection](../mysqli-connection/index.md) | MySQL | `selectDatabase`, а также `setStorageEngine` из `MysqlCommonConnection` |
| [PgsqlConnection](../pgsql-connection/index.md) | PostgreSQL | [getTableFullTextFields](../pgsql-connection/get-table-full-text-fields.md), [connectionErrorHandler](../pgsql-connection/connection-error-handler.md) |

### Что реализовать в наследнике

Свой класс соединения наследует `Connection` и реализует абстрактные методы. Защищенные методы код приложения не вызывает, но наследник обязан их реализовать:

- `createSqlHelper` — создает объект `SqlHelper` для своего типа базы данных,
- `connectInternal` и `disconnectInternal` — открывают и закрывают подключение,
- `queryInternal` — выполняет запрос и выбрасывает `SqlQueryException` при ошибке,
- `createResult` — создает объект результата запроса.

Наследник также реализует публичные абстрактные методы [getInsertedId](get-inserted-id.md), [getAffectedRowsCount](get-affected-rows-count.md), [isTableExists](is-table-exists.md), [isIndexExists](is-index-exists.md), [getIndexName](get-index-name.md), [getTableFields](get-table-fields.md), [createTable](create-table.md), [renameTable](rename-table.md), [dropTable](drop-table.md), [startTransaction](start-transaction.md), [commitTransaction](commit-transaction.md), [rollbackTransaction](rollback-transaction.md), [getType](get-type.md), [getVersion](get-version.md) и [getErrorMessage](get-error-message.md).

## Смотрите также

- [Выполнение запросов](../../../../database/query-execution.md)
- [Транзакции](../../../../database/transactions.md)
- [SqlExpression](../sql-expression/index.md)
