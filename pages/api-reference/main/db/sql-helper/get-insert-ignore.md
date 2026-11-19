---
title: Подготовить вставку без ошибки дубликата SqlHelper::getInsertIgnore
description: Метод SqlHelper::getInsertIgnore строит запрос INSERT, который пропускает строки с уже существующим ключом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getInsertIgnore` строит запрос `INSERT`, который пропускает строки с уже существующим ключом вместо ошибки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getInsertIgnore($tableName, $fields, $sql)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| fields\* | `string` | Задает список колонок в скобках, например ` (CODE, CNT)` |
| sql\* | `string` | Задает запрос `SELECT` или список `VALUES`, например ` VALUES ('kg', 1)` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

Метод склеивает аргументы без пробелов, кавычек и экранирования. Добавьте пробелы в начало `fields` и `sql`, возьмите имена в кавычки через [quote](quote.md) и экранируйте значения.

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `INSERT IGNORE INTO <tableName><fields><sql>` |
| `PgsqlSqlHelper` | `INSERT INTO <tableName><fields><sql> ON CONFLICT DO NOTHING` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код дважды добавляет строку с одним ключом. Второй запрос не вызывает ошибку:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL PRIMARY KEY, CNT INT NOT NULL)');

try
{
    $sql = $helper->getInsertIgnore(
        $helper->quote('demo_api_counters'),
        ' (' . $helper->quote('CODE') . ', ' . $helper->quote('CNT') . ')',
        " VALUES ('" . $helper->forSql('kg') . "', 1)"
    );
    $connection->queryExecute($sql);
    $connection->queryExecute($sql);

    echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_counters');
}
finally
{
    $connection->dropTable('demo_api_counters');
}
```

Код выведет `1`.

## Смотрите также

- [SqlHelper::prepareMergeValues](prepare-merge-values.md)
