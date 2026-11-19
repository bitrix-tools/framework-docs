---
title: Получить поле ORM по типу колонки SqlHelper::getFieldByColumnType
description: Метод SqlHelper::getFieldByColumnType создает объект поля ORM, который соответствует типу колонки базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.2

{% endnote %}

Метод `SqlHelper::getFieldByColumnType` создает объект поля ORM для колонки базы данных по ее типу. Результат запроса и `Connection::getTableFields` используют метод, чтобы описать колонки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getFieldByColumnType($name, $type, ?array $parameters = null);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя колонки — имя нового поля |
| type\* | `int`, `string` | Задает тип колонки. В MySQL — константа `MYSQLI_TYPE_*`, в PostgreSQL — имя типа, например `bigint` |
| parameters | `array`, `null` | Реализации MySQL и PostgreSQL не используют параметр. По умолчанию — `null` |

Типы `name` и `type` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект наследника `Bitrix\Main\ORM\Fields\ScalarField` с заданным соединением.

| Поле | MySQL | PostgreSQL |
| --- | --- | --- |
| `IntegerField` размером 2 | `TINY`, `SHORT` | `smallint`, `int2`, `smallserial`, `serial2` |
| `IntegerField` размером 4 | `LONG`, `INT24`, `CHAR` | `integer`, `int`, `int4`, `serial`, `serial4` |
| `IntegerField` размером 8 | `LONGLONG` | `bigint`, `int8`, `bigserial`, `serial8` |
| `FloatField` | `DECIMAL`, `NEWDECIMAL`, `FLOAT`, `DOUBLE` | `double precision`, `float4`, `float8`, `numeric`, `decimal`, `real` |
| `DatetimeField` | `DATETIME`, `TIMESTAMP` | `timestamp`, `timestamptz`, `timestamp with time zone`, `timestamp without time zone` |
| `DateField` | `DATE`, `NEWDATE` | `date` |
| `StringField` | Остальные типы | `bytea` с признаком двоичных данных и остальные типы |

## Примеры

**Пример.** Код создает поле для колонки типа `DATETIME` в MySQL:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = Application::getConnection()->getSqlHelper()->getFieldByColumnType('CREATED', MYSQLI_TYPE_DATETIME);

echo get_class($field);
```

## Смотрите также

- [SqlHelper::getColumnTypeByField](get-column-type-by-field.md)
- [Result::getFields](../result/get-fields.md)
