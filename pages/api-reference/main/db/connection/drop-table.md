---
title: Удалить таблицу Connection::dropTable
description: Метод Connection::dropTable удаляет таблицу и очищает кеш описания ее колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::dropTable` удаляет таблицу запросом `DROP TABLE` и очищает кеш описания ее колонок. Запрос не содержит `IF EXISTS`. Если таблицы нет, база данных вернет ошибку.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function dropTable($tableName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает рабочую таблицу, удаляет ее и проверяет, что таблицы больше нет:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL)');
$connection->dropTable('demo_api_status');

var_dump($connection->isTableExists('demo_api_status'));
```

## Смотрите также

- [Connection::isTableExists](is-table-exists.md)
- [Connection::truncateTable](truncate-table.md)
