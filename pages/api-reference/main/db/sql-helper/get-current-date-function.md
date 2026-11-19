---
title: Получить функцию текущей даты SqlHelper::getCurrentDateFunction
description: Метод SqlHelper::getCurrentDateFunction возвращает SQL-функцию текущей даты без времени для типа базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getCurrentDateFunction` возвращает SQL-функцию, которая дает текущую дату без времени на сервере базы данных.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getCurrentDateFunction();
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `MysqliSqlHelper` | `CURDATE()` |
| `PgsqlSqlHelper` | `current_date` |

## Примеры

**Пример.** Код считает пользователей, которые зарегистрировались сегодня:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE ' . $helper->getDatetimeToDateFunction('DATE_REGISTER') . ' = ' . $helper->getCurrentDateFunction()
);
```

## Смотрите также

- [SqlHelper::getCurrentDateTimeFunction](get-current-date-time-function.md)
- [SqlHelper::getDatetimeToDateFunction](get-datetime-to-date-function.md)
