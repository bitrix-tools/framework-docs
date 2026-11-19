---
title: Получить код ошибки Connection::getErrorCode
description: Метод Connection::getErrorCode возвращает код ошибки последней операции с базой данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getErrorCode` возвращает код ошибки последней операции на этом подключении. По коду отличают ошибки, которые нужно обработать особо, например нарушение уникальности ключа.

Если установлен модуль кластера `cluster`, запрос `SELECT` может выполнить соединение с репликой. Тогда `getErrorCode` основного соединения вернет код другой операции.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getErrorCode()
```

## Возвращаемое значение

Тип и источник значения зависят от реализации.

| Реализация | Значение |
| --- | --- |
| `Connection` | Базовый класс всегда возвращает `0` |
| `MysqliConnection` | Целое число `int` из свойства `errno` объекта `mysqli`, например `1062`. Если ошибки не было — `0` |
| `PgsqlConnection` | Строка `string` с кодом SQLSTATE из сообщения об ошибке, например `23505`. Если кода в сообщении нет — пустая строка |

Вызывайте метод, только когда подключение уже открыто. Реализации обращаются к ресурсу подключения напрямую.

## Примеры

**Пример.** Код выполняет ошибочный запрос и выводит код ошибки:

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
    var_dump($connection->getErrorCode());
}
```

Для MySQL код выведет `int(1054)`.

## Смотрите также

- [Connection::getErrorMessage](get-error-message.md)
