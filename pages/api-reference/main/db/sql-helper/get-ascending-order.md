---
title: Получить сортировку по возрастанию SqlHelper::getAscendingOrder
description: Метод SqlHelper::getAscendingOrder возвращает указание сортировки по возрастанию для ORDER BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.0

{% endnote %}

Метод `SqlHelper::getAscendingOrder` возвращает указание сортировки по возрастанию для `ORDER BY`. ORM берет направление сортировки из этого метода. Реализация PostgreSQL добавляет `NULLS FIRST` и ставит `NULL` первыми.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getAscendingOrder()
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `SqlHelper`, `MysqliSqlHelper` | `ASC` |
| `PgsqlSqlHelper` | `ASC NULLS FIRST` |

## Примеры

**Пример.** Код выводит первый логин при сортировке по дате последнего входа по возрастанию:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT LOGIN FROM ' . $helper->quote(UserTable::getTableName())
    . ' ORDER BY LAST_LOGIN ' . $helper->getAscendingOrder()
);
```

## Смотрите также

- [SqlHelper::getDescendingOrder](get-descending-order.md)
