---
title: Преобразовать значение из базы данных SqlHelper::convertFromDb
description: Метод SqlHelper::convertFromDb преобразует значение из базы данных в значение PHP по типу поля ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.2

{% endnote %}

Метод `SqlHelper::convertFromDb` преобразует значение, прочитанное из базы данных, в значение PHP по типу поля ORM. Например, для `DatetimeField` метод возвращает объект `Bitrix\Main\Type\DateTime`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDb($value, ORM\Fields\IReadable $field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |
| field\* | `Bitrix\Main\ORM\Fields\IReadable` | Задает поле ORM |

Тип `value` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает результат метода `convertValueFromDb` поля. Тип значения зависит от поля.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ObjectException` | Для поля даты или даты и времени строку не удалось разобрать |

## Примеры

**Пример.** Код преобразует строку из базы данных в объект даты по полю ORM:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Fields\DatetimeField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$field = new DatetimeField('DATE_REGISTER');
$field->setConnection($connection);

$value = $connection->getSqlHelper()->convertFromDb('2024-01-01 10:00:00', $field);
echo get_class($value) . ' ' . $value->format('Y-m-d H:i');
```

## Смотрите также

- [SqlHelper::convertToDb](convert-to-db.md)
- [SqlHelper::getConverter](get-converter.md)
