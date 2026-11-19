---
title: Преобразовать значение для SQL SqlHelper::convertToDb
description: Метод SqlHelper::convertToDb преобразует значение PHP в литерал SQL по типу поля ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.2

{% endnote %}

Метод `SqlHelper::convertToDb` преобразует значение PHP в литерал SQL, который можно подставить в запрос. Если код передает поле ORM, метод преобразует значение по типу поля. Методы [prepareInsert](prepare-insert.md) и [prepareUpdate](prepare-update.md) вызывают его для каждой колонки.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDb($value, ?ORM\Fields\IReadable $field = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение |
| field | `Bitrix\Main\ORM\Fields\IReadable`, `null` | Задает поле ORM, по типу которого метод преобразует значение, например результат [Connection::getTableField](../connection/get-table-field.md). По умолчанию — `null` |

Тип `value` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает литерал SQL. Для большинства полей это строка `string`, для поля `IntegerField` — целое число `int`. Метод проверяет условия по порядку.

- Значение `null` метод возвращает как `NULL`.
- Объект `SqlExpression` метод возвращает собранным SQL-фрагментом.
- Для `StringField` с размером метод обрезает строку до этого размера.
- Если код передал поле, метод возвращает результат `convertValueToDb` поля. Например, `DatetimeField` вызывает [convertToDbDateTime](convert-to-db-date-time.md).
- Без поля метод экранирует значение как строку через [convertToDbString](convert-to-db-string.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Код передал для поля `DatetimeField` или для `DateField` ORM-класса непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `\Error` | Код передал для поля `DateField`, которое не привязано к ORM-классу, непустое значение, но не объект `Bitrix\Main\Type\Date` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных для экранирования не удалось |

## Примеры

**Пример.** Код преобразует одно и то же значение без поля и по полю целого типа:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Fields\IntegerField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$field = new IntegerField('SORT');
$field->setConnection($connection);

echo $helper->convertToDb('10abc') . ' / ' . $helper->convertToDb('10abc', $field);
```

Код выведет `'10abc' / 10`.

## Смотрите также

- [SqlHelper::convertFromDb](convert-from-db.md)
- [SqlHelper::prepareInsert](prepare-insert.md)
