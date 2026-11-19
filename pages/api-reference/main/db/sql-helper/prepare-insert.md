---
title: Подготовить колонки и значения для INSERT SqlHelper::prepareInsert
description: Метод SqlHelper::prepareInsert готовит список колонок и значений для запроса INSERT с преобразованием по типам колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareInsert` готовит список колонок и значений для запроса `INSERT`. Метод экранирует значения и преобразует их по типам колонок таблицы. Метод [Connection::add](../connection/add.md) использует его, чтобы добавить строку.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareInsert($tableName, array $fields, $returnAsArray = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| fields\* | `array` | Задает значения в виде `имя колонки => значение`. Регистр имени не важен. Метод превращает `null` в `NULL`, объект `SqlExpression` — в собранный SQL-фрагмент |
| returnAsArray | `bool` | Возвращает колонки и значения массивами, если равен `true`. По умолчанию — `false`, строками через запятую |

Типы `tableName` и `returnAsArray` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает массив из трех элементов.

#|
|| Ключ | Описание ||
|| 0<br>`string`, `string[]` | Содержит имена колонок в кавычках ||
|| 1<br>`string`, `string[]` | Содержит значения в формате SQL в том же порядке ||
|| 2<br>`array` | Содержит дополнительные данные для отдельной записи больших полей. В MySQL и PostgreSQL массив всегда пуст ||
|#

Колонку, которой нет в таблице, метод пропускает и выдает предупреждение `E_USER_WARNING`. Описание колонок метод получает через [Connection::getTableFields](../connection/get-table-fields.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код готовит и выполняет запрос `INSERT` для рабочей таблицы:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_units (ID INT NOT NULL, CODE VARCHAR(20) NOT NULL)');

try
{
    [$columns, $values] = $helper->prepareInsert('demo_api_units', ['ID' => 1, 'CODE' => "kg'"]);
    $connection->queryExecute(
        'INSERT INTO ' . $helper->quote('demo_api_units') . ' (' . $columns . ') VALUES (' . $values . ')'
    );

    echo $connection->queryScalar('SELECT CODE FROM demo_api_units');
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

## Смотрите также

- [SqlHelper::prepareUpdate](prepare-update.md)
- [Connection::add](../connection/add.md)
