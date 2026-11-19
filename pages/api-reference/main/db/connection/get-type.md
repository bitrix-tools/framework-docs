---
title: Получить тип базы данных Connection::getType
description: Метод Connection::getType возвращает тип базы данных соединения — mysql или pgsql.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getType` возвращает тип базы данных соединения. По типу код выбирает SQL, который отличается в MySQL и PostgreSQL. Метод не обращается к базе данных.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getType();
```

## Возвращаемое значение

Метод возвращает строку `string`.

| Реализация | Значение |
| --- | --- |
| `MysqliConnection` | `mysql` |
| `PgsqlConnection` | `pgsql` |

## Примеры

**Пример.** Код выбирает функцию текущей даты под тип базы данных:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$sql = $connection->getType() === 'pgsql'
    ? 'SELECT CURRENT_DATE AS TODAY'
    : 'SELECT CURDATE() AS TODAY';

echo $connection->queryScalar($sql);
```

## Смотрите также

- [Connection::getVersion](get-version.md)
- [Connection::getSqlHelper](get-sql-helper.md)
