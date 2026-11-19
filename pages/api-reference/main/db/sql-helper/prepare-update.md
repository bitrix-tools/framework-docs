---
title: Подготовить присваивания для UPDATE SqlHelper::prepareUpdate
description: Метод SqlHelper::prepareUpdate готовит список присваиваний для запроса UPDATE с преобразованием по типам колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::prepareUpdate` готовит список присваиваний `колонка = значение` для запроса `UPDATE`. Значения метод экранирует и преобразует по типам колонок таблицы. Условие `WHERE` код добавляет сам.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareUpdate($tableName, array $fields)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| fields\* | `array` | Задает новые значения в виде `имя колонки => значение`. Регистр имени не важен. Метод подставляет объект `SqlExpression` собранным SQL-фрагментом |

Тип `tableName` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив из двух элементов.

#|
|| Ключ | Описание ||
|| 0<br>`string` | Содержит присваивания через запятую, например `` `CODE` = 'kg' `` ||
|| 1<br>`array` | Содержит дополнительные данные для отдельной записи больших полей. В MySQL и PostgreSQL массив всегда пуст ||
|#

Колонку, которой нет в таблице, метод пропускает и выдает предупреждение `E_USER_WARNING`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код меняет значение колонки `CODE` и увеличивает счетчик выражением:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\DB\SqlExpression;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$connection->queryExecute('CREATE TABLE demo_api_units (ID INT NOT NULL, CODE VARCHAR(20) NOT NULL, CNT INT NOT NULL)');

try
{
    $connection->queryExecute("INSERT INTO demo_api_units (ID, CODE, CNT) VALUES (1, 'kg', 5)");

    [$update] = $helper->prepareUpdate('demo_api_units', [
        'CODE' => 'g',
        'CNT' => new SqlExpression('?# + ?i', 'CNT', 1),
    ]);
    $connection->queryExecute('UPDATE ' . $helper->quote('demo_api_units') . ' SET ' . $update . ' WHERE ID = 1');

    print_r($connection->query('SELECT CODE, CNT FROM demo_api_units')->fetch());
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

## Смотрите также

- [SqlHelper::prepareInsert](prepare-insert.md)
- [SqlHelper::prepareAssignment](prepare-assignment.md)
