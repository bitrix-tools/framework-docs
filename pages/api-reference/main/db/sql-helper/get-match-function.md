---
title: Получить условие полнотекстового поиска SqlHelper::getMatchFunction
description: Метод SqlHelper::getMatchFunction возвращает SQL-условие полнотекстового поиска для типа базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getMatchFunction` возвращает SQL-условие полнотекстового поиска по колонке. Методы [getMatchAndExpression](get-match-and-expression.md) и [getMatchOrExpression](get-match-or-expression.md) собирают строку поиска. Метод [createIndex](../connection/create-index.md) соединений MySQL и PostgreSQL с типом `INDEX_FULLTEXT` создает индекс для колонки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getMatchFunction($field, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает колонку или список колонок. Метод подставляет значение в SQL без экранирования |
| value\* | `string` | Задает строку поиска в кавычках, например результат [convertToDbString](convert-to-db-string.md). Метод подставляет значение в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — SQL-условие.

| Реализация | Условие |
| --- | --- |
| `MysqliSqlHelper` | `MATCH (<field>) AGAINST (<value> IN BOOLEAN MODE)` |
| `PgsqlSqlHelper` | `to_tsvector('english'::regconfig, <field>) @@ to_tsquery('english'::regconfig, <value>)` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код ищет заметки, в тексте которых есть оба слова. Код создает рабочую таблицу с полнотекстовым индексом и в конце удаляет ее:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\Connection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_notes (ID INT NOT NULL, TITLE VARCHAR(255) NOT NULL)');

try
{
    $connection->createIndex('demo_api_notes', 'ix_demo_api_notes_title', ['TITLE'], null, Connection::INDEX_FULLTEXT);
    $connection->queryExecute("INSERT INTO demo_api_notes (ID, TITLE) VALUES (1, 'unit of mass'), (2, 'unit of length')");

    $search = $helper->getMatchAndExpression(['unit', 'mass']);
    $condition = $helper->getMatchFunction('TITLE', $helper->convertToDbString($search));

    echo $connection->queryScalar('SELECT ID FROM demo_api_notes WHERE ' . $condition);
}
finally
{
    $connection->dropTable('demo_api_notes');
}
```

## Смотрите также

- [SqlHelper::getMatchAndExpression](get-match-and-expression.md)
- [SqlHelper::getMatchOrExpression](get-match-or-expression.md)
- [Connection::createIndex](../connection/create-index.md)
