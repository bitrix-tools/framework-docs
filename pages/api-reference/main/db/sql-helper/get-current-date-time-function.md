---
title: Получить функцию текущих даты и времени SqlHelper::getCurrentDateTimeFunction
description: Метод SqlHelper::getCurrentDateTimeFunction возвращает SQL-функцию текущих даты и времени для типа базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getCurrentDateTimeFunction` возвращает SQL-функцию, которая дает текущие дату и время на сервере базы данных.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
abstract public function getCurrentDateTimeFunction();
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `MysqliSqlHelper` | `NOW()` |
| `PgsqlSqlHelper` | `now()` |

## Примеры

**Пример.** Код запрашивает текущее время сервера базы данных:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar('SELECT ' . $helper->getCurrentDateTimeFunction());
```

## Смотрите также

- [SqlHelper::getCurrentDateFunction](get-current-date-function.md)
- [SqlHelper::addSecondsToDateTime](add-seconds-to-date-time.md)
