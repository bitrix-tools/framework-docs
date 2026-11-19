---
title: Переименовать таблицу Connection::renameTable
description: Метод Connection::renameTable переименовывает таблицу и очищает кеш описания ее колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.4

{% endnote %}

Метод `Connection::renameTable` переименовывает таблицу. Таблица должна существовать, а новое имя — быть свободным. После запроса метод очищает кеш описания колонок для старого имени.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function renameTable($currentName, $newName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| currentName\* | `string` | Задает текущее имя таблицы |
| newName\* | `string` | Задает новое имя таблицы |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Реализации выполняют разные запросы.

| Реализация | Запрос |
| --- | --- |
| `MysqliConnection` | `RENAME TABLE ... TO ...` |
| `PgsqlConnection` | `ALTER TABLE ... RENAME TO ...` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет или новое имя занято |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает таблицу, переименовывает ее и удаляет под новым именем:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_draft (ID INT NOT NULL)');
$connection->renameTable('demo_api_draft', 'demo_api_final');

try
{
    var_dump($connection->isTableExists('demo_api_final'));
}
finally
{
    $connection->dropTable('demo_api_final');
}
```

## Смотрите также

- [Connection::dropTable](drop-table.md)
- [Connection::clearCaches](clear-caches.md)
