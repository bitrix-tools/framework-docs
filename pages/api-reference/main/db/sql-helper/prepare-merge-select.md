---
title: Подготовить вставку из выборки с обновлением SqlHelper::prepareMergeSelect
description: Метод SqlHelper::prepareMergeSelect строит запрос, который добавляет строки из SELECT или VALUES и обновляет строки с совпадающим ключом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareMergeSelect` строит запрос, который добавляет строки из выборки `SELECT` или списка `VALUES`, а строки с совпадающим ключом обновляет. Метод [prepareMergeValues](prepare-merge-values.md) использует его для готовых значений.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareMergeSelect($tableName, array $primaryFields, array $selectFields, $select, $updateFields)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| primaryFields\* | `string[]` | Задает колонки уникального ключа. Реализация MySQL не использует параметр |
| selectFields\* | `string[]` | Задает колонки, в которые запрос добавляет значения. Метод берет имена в кавычки |
| select\* | `string` | Задает запрос `SELECT` или список `VALUES (...)`. Метод подставляет значение в SQL без экранирования |
| updateFields\* | `array` | Задает значения для обновления в виде `имя колонки => значение`. Метод преобразует значения по типам колонок и подставляет объект `SqlExpression` собранным SQL-фрагментом |

Типы `tableName`, `select` и `updateFields` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — текст запроса.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `INSERT INTO ... (<selectFields>) <select> ON DUPLICATE KEY UPDATE ...` |
| `PgsqlSqlHelper` | `INSERT INTO ... (<selectFields>) <select> ON CONFLICT (<primaryFields>) DO UPDATE SET ...` |

Колонку `updateFields`, которой нет в таблице, метод пропускает и выдает предупреждение `E_USER_WARNING`.

В выражениях `updateFields` указывайте колонку вместе с именем таблицы, например `demo_api_counters.CNT`. Если в выборке есть колонка с тем же именем, MySQL вернет ошибку неоднозначного имени.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код копирует строки из одной рабочей таблицы в другую и при совпадении ключа увеличивает счетчик:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlExpression;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL PRIMARY KEY, CNT INT NOT NULL)');
$connection->queryExecute('CREATE TABLE demo_api_counters_new (CODE VARCHAR(20) NOT NULL, CNT INT NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_counters (CODE, CNT) VALUES ('kg', 1)");
    $connection->queryExecute("INSERT INTO demo_api_counters_new (CODE, CNT) VALUES ('kg', 5), ('m', 7)");

    $sql = $helper->prepareMergeSelect(
        'demo_api_counters',
        ['CODE'],
        ['CODE', 'CNT'],
        'SELECT CODE, CNT FROM demo_api_counters_new',
        ['CNT' => new SqlExpression('?# + 1', 'demo_api_counters.CNT')]
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

- [SqlHelper::prepareMergeValues](prepare-merge-values.md)
- [SqlHelper::prepareMerge](prepare-merge.md)
