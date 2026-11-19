---
title: Получить функцию случайного числа SqlHelper::getRandomFunction
description: Метод SqlHelper::getRandomFunction возвращает SQL-функцию случайного числа для типа базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getRandomFunction` возвращает SQL-функцию случайного числа. Выражение `ORDER BY <функция>` сортирует строки в случайном порядке.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getRandomFunction()
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | `rand()` |
| `PgsqlSqlHelper` | `random()` |

## Примеры

**Пример.** Код выбирает случайного пользователя:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT LOGIN FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ' . $helper->getRandomFunction()
);
```

## Смотрите также

- [SqlHelper::getAscendingOrder](get-ascending-order.md)
