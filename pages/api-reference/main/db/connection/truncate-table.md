---
title: Очистить таблицу Connection::truncateTable
description: Метод Connection::truncateTable удаляет все строки таблицы запросом TRUNCATE TABLE.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.4

{% endnote %}

Метод `Connection::truncateTable` удаляет все строки таблицы запросом `TRUNCATE TABLE`. Структура таблицы остается прежней.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function truncateTable($tableName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\Result` — результат запроса.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код заполняет рабочую таблицу, очищает ее и выводит число строк:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new'), (2, 'done')");
    $connection->truncateTable('demo_api_status');

    echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_status');
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::dropTable](drop-table.md)
