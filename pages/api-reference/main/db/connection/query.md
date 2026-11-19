---
title: Выполнить SQL-запрос Connection::query
description: Метод Connection::query выполняет SQL-запрос, при необходимости ограничивает число строк и возвращает объект результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::query` выполняет SQL-запрос и возвращает объект результата. Аналог в классическом API — `CDatabase::Query`.

Метод не экранирует значения в тексте запроса. Значения, которые приходят извне, экранируйте через [getSqlHelper](get-sql-helper.md) или подставляйте через объект [SqlExpression](../sql-expression/index.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function query($sql)
```

Метод читает аргументы через `func_get_args()` и принимает их в одном из вариантов.

- `query($sql)`
- `query($sql, $limit)`
- `query($sql, $offset, $limit)`
- `query($sql, $binds)`
- `query($sql, $binds, $limit)`
- `query($sql, $binds, $offset, $limit)`

Если второй аргумент — массив, метод считает его параметром `binds`.

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sql\* | `string` | Задает текст SQL-запроса |
| binds | `array` | Передает массив значений в сведения о запросе для [startTracker](start-tracker.md). Реализации MySQL и PostgreSQL не подставляют эти значения в текст запроса |
| offset | `int` | Задает число строк, которые нужно пропустить. По умолчанию — `0`. Без `limit` метод не учитывает `offset` |
| limit | `int` | Задает наибольшее число строк результата. По умолчанию — `0`, без ограничения. Метод сам добавляет в запрос ограничение по правилам базы данных |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект наследника [Result](../result/index.md), например [MysqliResult](../mysqli-result/index.md) или [PgsqlResult](../pgsql-result/index.md). Строки читают методами [fetch](../result/fetch.md) и [fetchAll](../result/fetch-all.md). Колонки типа даты и времени результат возвращает объектами `Bitrix\Main\Type\Date` и `Bitrix\Main\Type\DateTime`.

Реализация для PostgreSQL приводит ключи строки результата к верхнему регистру.

Метод подключается к базе данных, если подключения еще нет. Если установлен модуль кластера `cluster`, пул соединений может отправить запрос `SELECT` или `SHOW` на реплику. Тогда запрос выполняет и подключается соединение с репликой.

Если выполнение запросов отключено через [disableQueryExecuting](disable-query-executing.md), метод не обращается к базе данных и сохраняет текст запроса в список [getDisabledQueryExecutingDump](get-disabled-query-executing-dump.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\DuplicateEntryException` | Запрос нарушил уникальность ключа. Класс наследует `SqlQueryException` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код выбирает пять активных пользователей. Код экранирует значение `Y` через `SqlHelper`:

  ```php
  <?php
  use Bitrix\Main\Application;
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $connection = Application::getConnection();
  $helper = $connection->getSqlHelper();

  $sql = 'SELECT ID, LOGIN FROM ' . $helper->quote(UserTable::getTableName())
      . " WHERE ACTIVE = '" . $helper->forSql('Y') . "' ORDER BY ID";

  $result = $connection->query($sql, 5);
  while ($row = $result->fetch())
  {
      echo $row['ID'] . ' ' . $row['LOGIN'] . PHP_EOL;
  }
  ```

- Классический API

  **Пример.** Код выполняет тот же запрос через `CDatabase::Query`. Код задает ограничение по числу строк в тексте запроса в синтаксисе MySQL:

  ```php
  <?php
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $DB;

  $result = $DB->Query(
      'SELECT ID, LOGIN FROM ' . UserTable::getTableName() . " WHERE ACTIVE = 'Y' ORDER BY ID LIMIT 5"
  );
  while ($row = $result->Fetch())
  {
      echo $row['ID'] . ' ' . $row['LOGIN'] . PHP_EOL;
  }
  ```

{% endlist %}

## Смотрите также

- [Connection::queryScalar](query-scalar.md)
- [Connection::queryExecute](query-execute.md)
- [Выполнение запросов](../../../../database/query-execution.md)
