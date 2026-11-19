---
title: Получить результат драйвера Result::getResource
description: Метод Result::getResource возвращает результат запроса в формате драйвера базы данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::getResource` возвращает результат запроса в формате драйвера базы данных. Через него код обращается к функциям драйвера, которых нет в `Result`.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function getResource()
```

## Возвращаемое значение

Метод возвращает значение, которое реализация получила от драйвера.

| Реализация | Значение |
| --- | --- |
| `MysqliResult` | Объект `mysqli_result` для запроса с выборкой. Для запроса без выборки, например `UPDATE`, — `true` |
| `PgsqlResult` | Объект `PgSql\Result` |
| `ArrayResult` | Массив строк |

Если код отключил выполнение запросов через [Connection::disableQueryExecuting](../connection/disable-query-executing.md), метод возвращает `true`.

## Примеры

**Пример.** Код выводит класс результата драйвера:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query('SELECT ID FROM ' . UserTable::getTableName(), 1);

echo get_class($result->getResource());
```

Для MySQL код выведет `mysqli_result`.

## Смотрите также

- [Connection::query](../connection/query.md)
