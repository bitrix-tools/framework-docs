---
title: Получить сообщение об ошибке Connection::getErrorMessage
description: Метод Connection::getErrorMessage возвращает сообщение об ошибке последней операции с базой данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getErrorMessage` возвращает сообщение базы данных об ошибке последней операции на этом подключении. Аналог в классическом API — `CDatabase::GetErrorMessage`.

Метод [query](query.md) передает сообщение в исключение `SqlQueryException`. При обработке исключения читайте сообщение методом исключения `getDatabaseMessage`. Если установлен модуль кластера `cluster`, запрос `SELECT` может выполнить соединение с репликой, и `getErrorMessage` основного соединения вернет сведения о другой операции.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getErrorMessage();
```

## Возвращаемое значение

Метод возвращает строку `string`. Формат зависит от реализации.

| Реализация | Формат |
| --- | --- |
| `MysqliConnection` | Код и текст ошибки, например `(1054) Unknown column 'X' in 'field list'`. Если ошибки не было, код равен `0`, а текст пустой |
| `PgsqlConnection` | Текст функции `pg_last_error` |

Вызывайте метод, только когда подключение уже открыто. Реализации обращаются к ресурсу подключения напрямую.

## Примеры

**Пример.** Код выполняет ошибочный запрос и выводит сообщение базы данных из исключения и из соединения:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlQueryException;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

try
{
    $connection->query('SELECT MISSING_COLUMN FROM ' . UserTable::getTableName());
}
catch (SqlQueryException $exception)
{
    echo $exception->getDatabaseMessage() . PHP_EOL;
    echo $connection->getErrorMessage();
}
```

## Смотрите также

- [Connection::getErrorCode](get-error-code.md)
- [Connection::query](query.md)
