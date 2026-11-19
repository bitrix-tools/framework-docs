---
title: Получить SqlHelper Connection::getSqlHelper
description: Метод Connection::getSqlHelper возвращает объект для экранирования значений и построения SQL под тип базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getSqlHelper` возвращает объект `SqlHelper` для типа базы данных соединения. Через него экранируют значения и имена перед подстановкой в SQL.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getSqlHelper()
```

## Возвращаемое значение

Метод возвращает объект наследника [SqlHelper](../sql-helper/index.md).

| Реализация | Класс объекта |
| --- | --- |
| `MysqliConnection` | [MysqliSqlHelper](../mysqli-sql-helper/index.md) |
| `PgsqlConnection` | [PgsqlSqlHelper](../pgsql-sql-helper/index.md) |

Метод создает объект при первом вызове и возвращает тот же объект при следующих вызовах для этого соединения.

## Примеры

**Пример.** Код экранирует строку и имя колонки перед подстановкой в запрос:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$login = "admin' OR '1'='1";

$sql = 'SELECT ID FROM ' . $helper->quote(UserTable::getTableName())
    . ' WHERE ' . $helper->quote('LOGIN') . " = '" . $helper->forSql($login) . "'";

var_dump($connection->queryScalar($sql));
```

## Смотрите также

- [SqlHelper и SqlExpression](../../../../database/sql-helper-and-expression.md)
- [SqlExpression](../sql-expression/index.md)
