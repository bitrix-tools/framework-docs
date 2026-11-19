---
title: Получить описание колонки Connection::getTableField
description: Метод Connection::getTableField возвращает объект поля ORM для одной колонки таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getTableField` возвращает объект поля ORM для одной колонки таблицы. Метод берет его из результата [getTableFields](get-table-fields.md) и использует тот же кеш.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getTableField($tableName, $columnName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |
| columnName\* | `string` | Задает имя колонки. Регистр должен совпадать с ключом массива `getTableFields`. В PostgreSQL ключи в верхнем регистре |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект наследника `Bitrix\Main\ORM\Fields\ScalarField` или `null`, если колонки нет.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку, например таблицы нет в MySQL |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выводит класс поля для колонки `LOGIN` таблицы пользователей:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = Application::getConnection()->getTableField(UserTable::getTableName(), 'LOGIN');

echo $field === null ? 'not found' : get_class($field);
```

## Смотрите также

- [Connection::getTableFields](get-table-fields.md)
