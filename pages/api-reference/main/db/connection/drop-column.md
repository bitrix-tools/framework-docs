---
title: Удалить колонку Connection::dropColumn
description: Метод Connection::dropColumn удаляет колонку и очищает кеш описания колонок таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::dropColumn` удаляет колонку запросом `ALTER TABLE ... DROP COLUMN` и очищает кеш описания колонок таблицы. Колонка должна существовать, не входить в первичный ключ и не быть последней в таблице.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function dropColumn($tableName, $columnName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| columnName\* | `string` | Задает имя колонки |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например колонки нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код удаляет колонку и выводит оставшиеся колонки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20), NOTE VARCHAR(255))');

try
{
    $connection->dropColumn('demo_api_status', 'NOTE');
    print_r(array_keys($connection->getTableFields('demo_api_status')));
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::getTableFields](get-table-fields.md)
