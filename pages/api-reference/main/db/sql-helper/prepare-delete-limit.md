---
title: Подготовить удаление с ограничением SqlHelper::prepareDeleteLimit
description: Метод SqlHelper::prepareDeleteLimit строит запрос DELETE, который удаляет не больше заданного числа строк.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareDeleteLimit` строит запрос `DELETE`, который удаляет не больше заданного числа строк в заданном порядке. Метод подходит, чтобы удалять большой объем данных частями.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareDeleteLimit($tableName, array $primaryFields, $where, array $order, $limit)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Метод берет его в кавычки |
| primaryFields\* | `string[]` | Задает колонки первичного ключа. Реализация MySQL не использует параметр |
| where\* | `string` | Задает условие отбора строк. Метод подставляет значение в SQL без экранирования |
| order\* | `array` | Задает сортировку в виде `имя колонки => направление`. Направление метод подставляет в SQL без экранирования, передавайте только `ASC` или `DESC` |
| limit\* | `int` | Задает наибольшее число строк. Метод приводит значение к целому числу |

Типы `tableName`, `where` и `limit` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `DELETE FROM ... WHERE <where> ORDER BY ... LIMIT <limit>` |
| `PgsqlSqlHelper` | `DELETE FROM ... WHERE (<primaryFields>) IN (SELECT <primaryFields> FROM ... WHERE <where> ORDER BY ... LIMIT <limit>)` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код удаляет две самые старые строки со статусом `done`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL PRIMARY KEY, STATUS VARCHAR(20) NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'done'), (2, 'done'), (3, 'done'), (4, 'new')");

    $sql = $helper->prepareDeleteLimit(
        'demo_api_status',
        ['ID'],
        "STATUS = '" . $helper->forSql('done') . "'",
        ['ID' => 'ASC'],
        2
    );
    $connection->queryExecute($sql);

    echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_status');
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

Код выведет `2`.

## Смотрите также

- [Connection::queryExecute](../connection/query-execute.md)
