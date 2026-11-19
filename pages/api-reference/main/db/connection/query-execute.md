---
title: Выполнить запрос без результата Connection::queryExecute
description: Метод Connection::queryExecute выполняет SQL-запрос и не возвращает результат. Подходит для INSERT, UPDATE, DELETE и DDL.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::queryExecute` выполняет SQL-запрос через [query](query.md) и не возвращает результат. Метод подходит для запросов `INSERT`, `UPDATE`, `DELETE` и изменения структуры таблиц.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function queryExecute($sql, ?array $binds = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sql\* | `string` | Задает текст SQL-запроса |
| binds | `array`, `null` | Передает массив значений в сведения о запросе для [startTracker](start-tracker.md). Реализации MySQL и PostgreSQL не подставляют эти значения в текст запроса. По умолчанию — `null` |

Тип `sql` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Метод [getAffectedRowsCount](get-affected-rows-count.md) возвращает число измененных строк.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\DuplicateEntryException` | Запрос нарушил уникальность ключа. Класс наследует `SqlQueryException` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает рабочую таблицу, добавляет строку, меняет ее и выводит число измененных строк. Блок `finally` удаляет таблицу:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();
$table = $helper->quote('demo_api_status');

$connection->queryExecute("CREATE TABLE {$table} (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)");

try
{
    $connection->queryExecute("INSERT INTO {$table} (ID, STATUS) VALUES (1, 'new')");
    $connection->queryExecute("UPDATE {$table} SET STATUS = '" . $helper->forSql('done') . "' WHERE ID = 1");

    echo $connection->getAffectedRowsCount();
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::query](query.md)
- [Connection::getAffectedRowsCount](get-affected-rows-count.md)
