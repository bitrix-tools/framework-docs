---
title: Получить число измененных строк Connection::getAffectedRowsCount
description: Метод Connection::getAffectedRowsCount возвращает число строк, которые изменил последний выполненный запрос.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getAffectedRowsCount` возвращает число строк, которые изменил последний запрос соединения. Вызывайте метод сразу после запроса `INSERT`, `UPDATE` или `DELETE`.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getAffectedRowsCount();
```

## Возвращаемое значение

Метод возвращает целое число `int`. Источник значения зависит от реализации.

| Реализация | Источник значения |
| --- | --- |
| `MysqliConnection` | Свойство `affected_rows` объекта `mysqli` — последний запрос на этом подключении |
| `PgsqlConnection` | Функция `pg_affected_rows` для результата последнего запроса, который выполнил метод `query` |

## Примеры

**Пример.** Код меняет строки рабочей таблицы и выводит, сколько строк изменилось. Блок `finally` удаляет таблицу:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new'), (2, 'new'), (3, 'done')");
    $connection->queryExecute("UPDATE demo_api_status SET STATUS = 'done' WHERE STATUS = 'new'");

    echo $connection->getAffectedRowsCount();
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

Код выведет `2`.

## Смотрите также

- [Connection::queryExecute](query-execute.md)
