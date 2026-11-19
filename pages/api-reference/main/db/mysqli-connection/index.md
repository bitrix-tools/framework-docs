---
title: MysqliConnection — соединение с MySQL
description: Класс Bitrix\Main\DB\MysqliConnection реализует соединение с MySQL через расширение mysqli.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\DB`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

## Когда использовать

Класс `MysqliConnection` — реализация [Connection](../connection/index.md) для MySQL через расширение `mysqli`. Объект возвращает `Application::getConnection()`, если в `.settings.php` для соединения указан `className` со значением `\Bitrix\Main\DB\MysqliConnection`.

Класс наследует абстрактный класс `MysqlCommonConnection`, а тот — `Connection`. Общая логика MySQL — транзакции, блокировки, структура таблиц — находится в `MysqlCommonConnection`. Сам `MysqliConnection` подключается к серверу и выполняет запросы через `mysqli`.

Класс [Connection](../connection/index.md) описывает методы, которые вызывает код приложения. Страницы методов `Connection` описывают поведение MySQL в таблицах реализаций.

## Методы класса

Методов ниже нет в классе `Connection`.

| Метод | Описание |
| --- | --- |
| `selectDatabase($database)` | Делает базу данных `database` текущей для подключения и возвращает `true` при успехе. Подключение должно быть открыто. Не меняет значение [getDatabase](../connection/get-database.md). Объявлен абстрактным в `MysqlCommonConnection`, реализован в `MysqliConnection` |
| `setStorageEngine()` | Задает движок таблиц по умолчанию из ключа `engine` настроек соединения запросом `SET default_storage_engine`, а при ошибке — `SET storage_engine`. Если ключа нет, ничего не делает. Исключение `SqlQueryException` перехватывает. Объявлен в `MysqlCommonConnection` |

## Наследование

Класс наследует `MysqlCommonConnection`, который наследует [Connection](../connection/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct` | Вызывает `mysqli_report(MYSQLI_REPORT_OFF)`. По комментарию в коде так класс возвращает поведение `mysqli`, которое действовало по умолчанию до PHP 8.1. Читает ключ `engine` настроек соединения |
| [getInsertedId](../connection/get-inserted-id.md) | Возвращает свойство `insert_id` объекта `mysqli` |
| [getAffectedRowsCount](../connection/get-affected-rows-count.md) | Возвращает свойство `affected_rows` объекта `mysqli` |
| [getVersion](../connection/get-version.md) | Возвращает массив `[версия, null]`, где версия — три числа через точку, например `8.0.36` |
| [getErrorMessage](../connection/get-error-message.md) | Возвращает код и текст ошибки в виде `(код) текст` |
| [getErrorCode](../connection/get-error-code.md) | Возвращает свойство `errno` объекта `mysqli` |
| [getType](../connection/get-type.md) | Возвращает `mysql`. Объявлен в `MysqlCommonConnection` |
| [isTableExists](../connection/is-table-exists.md) | Выполняет `SHOW TABLES LIKE`. Знаки `%` и `_` в имени работают как шаблон. Объявлен в `MysqlCommonConnection` |
| [getIndexName](../connection/get-index-name.md) | Читает индексы через `SHOW INDEX` и сравнивает имена колонок с учетом регистра. Объявлен в `MysqlCommonConnection` |
| [getTableFields](../connection/get-table-fields.md) | Выполняет `SELECT * ... LIMIT 0` в обход `query`. Принимает подзапрос в скобках. Объявлен в `MysqlCommonConnection` |
| [createTable](../connection/create-table.md) | Добавляет `AUTO_INCREMENT` и движок из ключа `engine`. Объявлен в `MysqlCommonConnection` |
| [createIndex](../connection/create-index.md) | Принимает длины колонок и тип индекса. Возвращает `false`, если индекс с таким именем уже есть. Объявлен в `MysqlCommonConnection` |
| [renameTable](../connection/rename-table.md) | Выполняет `RENAME TABLE`. Объявлен в `MysqlCommonConnection` |
| [dropTable](../connection/drop-table.md) | Выполняет `DROP TABLE` и очищает кеш описания колонок. Объявлен в `MysqlCommonConnection` |
| [startTransaction](../connection/start-transaction.md) | Открывает транзакцию или создает точку сохранения. Объявлен в `MysqlCommonConnection` |
| [commitTransaction](../connection/commit-transaction.md) | Выполняет `COMMIT` только на внешнем уровне. Объявлен в `MysqlCommonConnection` |
| [rollbackTransaction](../connection/rollback-transaction.md) | После отката вложенной транзакции выбрасывает `TransactionException`. Объявлен в `MysqlCommonConnection` |
| [lock](../connection/lock.md) | Выполняет `GET_LOCK` на основном сервере. Отрицательный таймаут означает ожидание без ограничения, по комментарию в коде это не работает в MariaDB. Объявлен в `MysqlCommonConnection` |
| [unlock](../connection/unlock.md) | Выполняет `RELEASE_LOCK` на основном сервере. Объявлен в `MysqlCommonConnection` |
| `getMaxAllowedPacket` | Читает переменную сервера `max_allowed_packet` и запоминает значение для всех объектов класса. Объявлен в `MysqlCommonConnection` |

### Унаследованные методы

Остальные методы работают как в классе [Connection](../connection/index.md#методы-класса).

## Смотрите также

- [Connection](../connection/index.md)
- [PgsqlConnection](../pgsql-connection/index.md)
- [MysqliResult](../mysqli-result/index.md)
