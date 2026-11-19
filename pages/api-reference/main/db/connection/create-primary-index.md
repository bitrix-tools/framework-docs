---
title: Создать первичный ключ Connection::createPrimaryIndex
description: Метод Connection::createPrimaryIndex добавляет первичный ключ в существующую таблицу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Connection::createPrimaryIndex` добавляет первичный ключ в существующую таблицу запросом `ALTER TABLE ... ADD PRIMARY KEY`. У таблицы не должно быть первичного ключа.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function createPrimaryIndex($tableName, $columnNames)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| columnNames\* | `string`, `string[]` | Задает колонку или список колонок первичного ключа |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\Result` — результат запроса.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например первичный ключ уже есть |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код добавляет составной первичный ключ и проверяет его через `getIndexName`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_links (UNIT_ID INT NOT NULL, STATUS_ID INT NOT NULL)');

try
{
    $connection->createPrimaryIndex('demo_api_links', ['UNIT_ID', 'STATUS_ID']);
    var_dump($connection->getIndexName('demo_api_links', ['UNIT_ID', 'STATUS_ID'], true));
}
finally
{
    $connection->dropTable('demo_api_links');
}
```

Для MySQL код выведет `PRIMARY`.

## Смотрите также

- [Connection::createIndex](create-index.md)
- [Connection::createTable](create-table.md)
