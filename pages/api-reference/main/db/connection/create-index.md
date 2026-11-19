---
title: Создать индекс Connection::createIndex
description: Метод Connection::createIndex создает индекс таблицы по одной или нескольким колонкам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.4

{% endnote %}

Метод `Connection::createIndex` создает индекс таблицы по одной или нескольким колонкам. Реализации MySQL и PostgreSQL принимают два дополнительных параметра — длины колонок и тип индекса.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function createIndex($tableName, $indexName, $columnNames)
```

Сигнатура в `MysqlCommonConnection`, от которого наследует `MysqliConnection`, и в `PgsqlConnection`:

```php
public function createIndex($tableName, $indexName, $columnNames, $columnLengths = null, $indexType = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| indexName\* | `string` | Задает имя нового индекса |
| columnNames\* | `string`, `string[]` | Задает колонку или список колонок индекса |
| columnLengths | `array`, `null` | Задает длину индексируемой части колонки в виде `имя колонки => длина`. Учитывает только MySQL. По умолчанию — `null` |
| indexType | `string`, `null` | Задает тип индекса — `Connection::INDEX_UNIQUE`, `Connection::INDEX_FULLTEXT` или `Connection::INDEX_SPATIAL`. Для другого значения метод создает обычный индекс. По умолчанию — `null`, обычный индекс |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\Result` или `false`. Поведение зависит от реализации.

| Реализация | Поведение |
| --- | --- |
| `Connection` | Базовая реализация создает обычный индекс и не принимает дополнительных параметров |
| `MysqliConnection` | Сравнивает тип индекса без учета регистра. Если индекс с таким именем уже есть, возвращает `false` без исключения |
| `PgsqlConnection` | Строит запрос с `IF NOT EXISTS`. Сравнивает тип индекса с учетом регистра. Для `INDEX_FULLTEXT` создает индекс `GIN` по `to_tsvector('english', ...)`. Для `INDEX_SPATIAL` создает обычный индекс |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, кроме совпадения имени индекса в MySQL |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает уникальный индекс по колонке `CODE`. Повторный вызов в MySQL вернет `false`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\Connection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_units (ID INT NOT NULL, CODE VARCHAR(20) NOT NULL)');

try
{
    $connection->createIndex('demo_api_units', 'ux_demo_api_units_code', 'CODE', null, Connection::INDEX_UNIQUE);
    var_dump($connection->createIndex('demo_api_units', 'ux_demo_api_units_code', 'CODE', null, Connection::INDEX_UNIQUE));
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

## Смотрите также

- [Connection::createPrimaryIndex](create-primary-index.md)
- [Connection::getIndexName](get-index-name.md)
