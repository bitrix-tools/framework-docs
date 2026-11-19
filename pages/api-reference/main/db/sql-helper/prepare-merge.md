---
title: Подготовить вставку с обновлением SqlHelper::prepareMerge
description: Метод SqlHelper::prepareMerge строит запрос, который добавляет строку или обновляет ее, если строка с таким ключом уже есть.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.0

{% endnote %}

Метод `SqlHelper::prepareMerge` строит запрос, который добавляет строку, а если строка с таким ключом уже есть — обновляет ее. Значения метод экранирует и преобразует по типам колонок.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function prepareMerge($tableName, array $primaryFields, array $insertFields, array $updateFields);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| primaryFields\* | `string[]` | Задает колонки уникального ключа. Реализация MySQL не использует параметр. В PostgreSQL список не должен быть пустым |
| insertFields\* | `array` | Задает значения для вставки в виде `имя колонки => значение` |
| updateFields\* | `array` | Задает значения для обновления в виде `имя колонки => значение`. Метод подставляет объект `SqlExpression` собранным SQL-фрагментом |

Тип `tableName` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив из одного элемента — текста запроса.

| Реализация | Запрос |
| --- | --- |
| `MysqliSqlHelper` | `INSERT INTO ... VALUES (...) ON DUPLICATE KEY UPDATE ...` |
| `PgsqlSqlHelper` | `INSERT INTO ... VALUES (...) ON CONFLICT (<primaryFields>) DO UPDATE SET ...` |

Метод возвращает пустой текст запроса, если в `insertFields` или `updateFields` нет ни одной колонки таблицы. В PostgreSQL то же происходит при пустом `primaryFields`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код дважды выполняет вставку с обновлением. Вторая вставка увеличивает счетчик существующей строки:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlExpression;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_counters (CODE VARCHAR(20) NOT NULL PRIMARY KEY, CNT INT NOT NULL)');

try
{
    for ($i = 0; $i < 2; $i++)
    {
        [$sql] = $helper->prepareMerge(
            'demo_api_counters',
            ['CODE'],
            ['CODE' => 'kg', 'CNT' => 1],
            ['CNT' => new SqlExpression('?# + 1', 'CNT')]
        );
        $connection->queryExecute($sql);
    }

    echo $connection->queryScalar('SELECT CNT FROM demo_api_counters');
}
finally
{
    $connection->dropTable('demo_api_counters');
}
```

Код выведет `2`.

## Смотрите также

- [SqlHelper::prepareMergeValues](prepare-merge-values.md)
- [SqlHelper::prepareMergeMultiple](prepare-merge-multiple.md)
