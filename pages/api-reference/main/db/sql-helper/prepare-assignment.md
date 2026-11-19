---
title: Подготовить присваивание одной колонки SqlHelper::prepareAssignment
description: Метод SqlHelper::prepareAssignment возвращает присваивание колонка = значение с преобразованием по типу колонки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `SqlHelper::prepareAssignment` возвращает присваивание `колонка = значение` для одной колонки. Значение метод экранирует и преобразует по типу колонки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function prepareAssignment($tableName, $columnName, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы. Таблица должна существовать |
| columnName\* | `string` | Задает имя колонки. Регистр должен совпадать с ключом [Connection::getTableFields](../connection/get-table-fields.md) |
| value\* | `mixed` | Задает значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string`, например `` `CODE` = 'kg' ``. Если колонки нет в таблице, метод экранирует значение как строку.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | В MySQL таблицы нет |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |
| `Bitrix\Main\ArgumentException` | Код передал для колонки даты и времени непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для колонки даты без времени непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код выводит присваивание для колонки рабочей таблицы:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_units (ID INT NOT NULL, CODE VARCHAR(20) NOT NULL)');

try
{
    echo $connection->getSqlHelper()->prepareAssignment('demo_api_units', 'CODE', "kg'");
}
finally
{
    $connection->dropTable('demo_api_units');
}
```

## Смотрите также

- [SqlHelper::prepareUpdate](prepare-update.md)
