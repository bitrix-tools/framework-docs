---
title: Получить одно значение Connection::queryScalar
description: Метод Connection::queryScalar выполняет запрос и возвращает значение первой колонки первой строки результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::queryScalar` выполняет запрос и возвращает значение первой колонки первой строки. Метод подходит для запросов вида `SELECT COUNT(*)` и выборки одного значения.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function queryScalar($sql, ?array $binds = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sql\* | `string` | Задает текст SQL-запроса. Не добавляйте в запрос ограничение по числу строк. Метод добавляет его сам |
| binds | `array`, `null` | Передает массив значений в сведения о запросе для [startTracker](start-tracker.md). Реализации MySQL и PostgreSQL не подставляют эти значения в текст запроса. По умолчанию — `null` |

Тип `sql` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает значение первой колонки первой строки. Число и строку метод возвращает строкой, дату и время — объектом `Bitrix\Main\Type\Date` или `Bitrix\Main\Type\DateTime`.

Метод возвращает `null`, если запрос не вернул строк или значение равно `NULL`.

Метод вызывает [query](query.md) с ограничением в одну строку.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса, в том числе если в тексте уже есть ограничение по числу строк |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код выводит число активных пользователей:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

$count = $connection->queryScalar(
    'SELECT COUNT(*) FROM ' . $helper->quote(UserTable::getTableName()) . " WHERE ACTIVE = 'Y'"
);

echo (int) $count;
```

## Смотрите также

- [Connection::query](query.md)
- [Connection::queryExecute](query-execute.md)
