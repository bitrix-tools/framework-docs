---
title: Получить сортировку по убыванию SqlHelper::getDescendingOrder
description: Метод SqlHelper::getDescendingOrder возвращает указание сортировки по убыванию для ORDER BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.0

{% endnote %}

Метод `SqlHelper::getDescendingOrder` возвращает указание сортировки по убыванию для `ORDER BY`. ORM берет направление сортировки из этого метода. Реализация PostgreSQL добавляет `NULLS LAST` и ставит `NULL` последними.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getDescendingOrder()
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | `DESC` |
| `PgsqlSqlHelper` | `DESC NULLS LAST` |

## Примеры

**Пример.** Код выводит пользователя, который входил на сайт последним:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT LOGIN FROM ' . $helper->quote(UserTable::getTableName())
    . ' ORDER BY LAST_LOGIN ' . $helper->getDescendingOrder()
);
```

## Смотрите также

- [SqlHelper::getAscendingOrder](get-ascending-order.md)
