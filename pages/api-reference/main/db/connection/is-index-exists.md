---
title: Проверить наличие индекса Connection::isIndexExists
description: Метод Connection::isIndexExists проверяет, есть ли в таблице индекс, который начинается с указанных колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::isIndexExists` проверяет, есть ли в таблице индекс, который начинается с указанных колонок. Метод вызывает [getIndexName](get-index-name.md) в нестрогом режиме. Аналог в классическом API — `CDatabase::IndexExists`, он также принимает флаг строгого сравнения.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function isIndexExists($tableName, array $columns);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| columns\* | `array` | Задает имена колонок в порядке индекса |

Тип `tableName` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если [getIndexName](get-index-name.md) нашел индекс, иначе `false`. Для пустого массива `columns` метод возвращает `false`.

Индекс по колонкам `A, B` подходит для списка `['A']`, но не для `['B']`. Правила сравнения — на странице [getIndexName](get-index-name.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет в MySQL |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код создает индекс по колонке `STATUS`, только если подходящего индекса еще нет:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');

try
{
    if (!$connection->isIndexExists('demo_api_status', ['STATUS']))
    {
        $connection->createIndex('demo_api_status', 'ix_demo_api_status_status', ['STATUS']);
    }

    var_dump($connection->isIndexExists('demo_api_status', ['STATUS']));
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::getIndexName](get-index-name.md)
- [Connection::createIndex](create-index.md)
