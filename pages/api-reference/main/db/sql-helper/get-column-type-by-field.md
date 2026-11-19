---
title: Получить тип колонки по полю ORM SqlHelper::getColumnTypeByField
description: Метод SqlHelper::getColumnTypeByField возвращает тип колонки базы данных для поля ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.2

{% endnote %}

Метод `SqlHelper::getColumnTypeByField` возвращает тип колонки базы данных для поля ORM. Метод [Connection::createTable](../connection/create-table.md) использует его, чтобы построить запрос `CREATE TABLE`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getColumnTypeByField(ORM\Fields\ScalarField $field);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `Bitrix\Main\ORM\Fields\ScalarField` | Задает поле ORM |

## Возвращаемое значение

Метод возвращает строку `string` — тип колонки.

| Поле | MySQL | PostgreSQL |
| --- | --- | --- |
| `IntegerField` | `smallint`, `int` или `bigint` для размера `2`, `4`, `8`. При другом размере — `int` | `smallint`, `integer` или `bigint` для размера `2`, `4`, `8`. При другом размере — `integer` |
| `DecimalField` | `decimal(<precision>, <scale>)`. Точность не больше `0` метод заменяет на `18`, масштаб не больше `0` — на `2` | `decimal(<precision>, <scale>)`. Точность не больше `0` метод заменяет на `18`, масштаб не больше `0` — на `2` |
| `FloatField` | `double` | `float8` |
| `DatetimeField` | `datetime` | `timestamp` |
| `DateField` | `date` | `date` |
| `TextField` | `longtext` для длинного текста, иначе `text` | `text` |
| `BooleanField` | `int`, если оба значения — числа. `char(1)`, если оба значения длиной в один символ. Иначе `varchar(<длина большего значения>)` | `int`, если оба значения — числа. `char(1)`, если оба значения длиной в один символ. Иначе `varchar(<длина большего значения>)` |
| `EnumField` | `varchar(<длина самого длинного значения>)` | `varchar(<длина самого длинного значения>)` |
| Другие поля | `varchar(<наименьший максимум из LengthValidator>)`. Без валидатора или с валидатором без максимума — `varchar(255)` | `varchar(<наименьший максимум из LengthValidator>)`. Без валидатора или с валидатором без максимума — `varchar(255)` |

Если у `DecimalField` масштаб после замены не меньше точности, метод использует `decimal(18, 2)`. Размер, заданный в `StringField` через `size`, метод не учитывает.

## Примеры

**Пример.** Код выводит типы колонок для нескольких полей:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Fields\BooleanField;
use Bitrix\Main\ORM\Fields\DatetimeField;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo $helper->getColumnTypeByField((new IntegerField('ID'))->configureSize(8)) . PHP_EOL;
echo $helper->getColumnTypeByField(new DatetimeField('CREATED')) . PHP_EOL;
echo $helper->getColumnTypeByField((new BooleanField('ACTIVE'))->configureValues('N', 'Y')) . PHP_EOL;
```

Для MySQL код выведет `bigint`, `datetime` и `char(1)`.

## Смотрите также

- [SqlHelper::getFieldByColumnType](get-field-by-column-type.md)
- [Connection::createTable](../connection/create-table.md)
