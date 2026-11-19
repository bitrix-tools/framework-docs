---
title: Подготовить обновление по другой таблице SqlHelper::prepareCorrelatedUpdate
description: Метод SqlHelper::prepareCorrelatedUpdate строит запрос UPDATE, который берет новые значения из других таблиц.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareCorrelatedUpdate` строит запрос `UPDATE`, который берет новые значения из других таблиц. Синтаксис такого запроса в MySQL и PostgreSQL разный, метод скрывает это различие.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareCorrelatedUpdate($tableName, $tableAlias, $fields, $from, $where)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя обновляемой таблицы. Метод подставляет значение в SQL без кавычек и экранирования |
| tableAlias\* | `string` | Задает псевдоним обновляемой таблицы. Метод подставляет значение в SQL без экранирования |
| fields\* | `array` | Задает присваивания в виде `имя колонки => SQL-выражение`. Метод подставляет имена и выражения в SQL без экранирования |
| from\* | `string` | Задает другие таблицы с псевдонимами, например `demo_api_counters_new n`. Метод подставляет значение в SQL без экранирования |
| where\* | `string` | Задает условие связи таблиц. Метод подставляет значение в SQL без экранирования |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `UPDATE <tableName> AS <tableAlias>, <from> SET <tableAlias>.<колонка> = <выражение> WHERE <where>` |
| `PgsqlSqlHelper` | `UPDATE <tableName> AS <tableAlias> SET <колонка> = <выражение> FROM <from> WHERE <where>` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |

## Примеры

**Пример.** Код копирует значения счетчика из одной рабочей таблицы в другую по совпадению кода:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL, CNT INT NOT NULL)');
$connection->queryExecute('CREATE TABLE demo_api_counters_new (CODE VARCHAR(20) NOT NULL, CNT INT NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_counters (CODE, CNT) VALUES ('kg', 1), ('m', 2)");
    $connection->queryExecute("INSERT INTO demo_api_counters_new (CODE, CNT) VALUES ('kg', 10)");

    $sql = $helper->prepareCorrelatedUpdate(
        'demo_api_counters',
        'c',
        ['CNT' => 'n.CNT'],
        'demo_api_counters_new n',
        'n.CODE = c.CODE'
    );
    $connection->queryExecute($sql);

    print_r($connection->query('SELECT CODE, CNT FROM demo_api_counters ORDER BY CODE')->fetchAll());
}
finally
{
    $connection->dropTable('demo_api_counters');
    $connection->dropTable('demo_api_counters_new');
}
```

## Смотрите также

- [SqlHelper::prepareUpdate](prepare-update.md)
