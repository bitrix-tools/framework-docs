---
title: Подготовить вставку нескольких строк с заменой SqlHelper::prepareMergeMultiple
description: Метод SqlHelper::prepareMergeMultiple строит запросы, которые добавляют несколько строк и заменяют строки с совпадающим ключом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareMergeMultiple` строит запросы, которые добавляют несколько строк и заменяют строки с совпадающим ключом. Метод делит строки на несколько запросов по объему значений.

Метод считает длину значений в символах. Когда сумма превышает 1 048 576 символов, метод закрывает запрос после текущей строки и начинает следующий. Поэтому каждый запрос, кроме последнего, немного больше этой границы.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareMergeMultiple($tableName, array $primaryFields, array $insertRows)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| primaryFields\* | `string[]` | Задает колонки уникального ключа. Реализация MySQL не использует параметр |
| insertRows\* | `array[]` | Задает строки в виде массивов `имя колонки => значение`. Список колонок метод берет из первой строки, поэтому у всех строк он должен совпадать |

Тип `tableName` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив строк `string[]` — тексты запросов. Выполните каждый запрос.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `REPLACE INTO ... VALUES (...), (...)` |
| `PgsqlSqlHelper` | `INSERT INTO ... VALUES (...), (...) ON CONFLICT (<primaryFields>) DO UPDATE SET (...) = (EXCLUDED....)` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\NotImplementedException` | Соединение работает не с MySQL и не с PostgreSQL. Базовый класс не реализует метод |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код добавляет три строки. Строка с кодом `kg` уже есть, и запрос заменяет ее значение:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL PRIMARY KEY, CNT INT NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_counters (CODE, CNT) VALUES ('kg', 1)");

    $queries = $helper->prepareMergeMultiple('demo_api_counters', ['CODE'], [
        ['CODE' => 'kg', 'CNT' => 10],
        ['CODE' => 'm', 'CNT' => 20],
        ['CODE' => 'l', 'CNT' => 30],
    ]);
    foreach ($queries as $sql)
    {
        $connection->queryExecute($sql);
    }

    echo $connection->queryScalar('SELECT SUM(CNT) FROM demo_api_counters');
}
finally
{
    $connection->dropTable('demo_api_counters');
}
```

Код выведет `60`.

## Смотрите также

- [SqlHelper::prepareMerge](prepare-merge.md)
- [SqlHelper::prepareMergeValues](prepare-merge-values.md)
