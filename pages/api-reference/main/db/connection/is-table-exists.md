---
title: Проверить наличие таблицы Connection::isTableExists
description: Метод Connection::isTableExists проверяет, есть ли таблица в базе данных соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::isTableExists` проверяет, есть ли таблица в базе данных соединения. Аналог в классическом API — `CDatabase::TableExists`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function isTableExists($tableName);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| tableName\* | `string` | Задает имя таблицы |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если таблица есть, иначе `false`. Способ проверки зависит от реализации.

| Реализация | Как проверяет |
| --- | --- |
| `MysqliConnection` | Удаляет из имени все символы, кроме латинских букв, цифр, `%` и `_`. Если имя стало пустым, возвращает `false`. Затем выполняет `SHOW TABLES LIKE` с этим именем, поэтому `%` и `_` работают как шаблон |
| `PgsqlConnection` | Ищет таблицу с точным именем в схеме `public` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код создает рабочую таблицу, только если ее еще нет. Блок `finally` удаляет таблицу, только если ее создал этот код:

  ```php
  <?php
  use Bitrix\Main\Application;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $connection = Application::getConnection();
  $created = false;

  try
  {
      if (!$connection->isTableExists('demo_api_status'))
      {
          $connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');
          $created = true;
      }

      var_dump($connection->isTableExists('demo_api_status'));
  }
  finally
  {
      if ($created)
      {
          $connection->dropTable('demo_api_status');
      }
  }
  ```

- Классический API

  **Пример.** Код проверяет таблицу пользователей через `CDatabase::TableExists`:

  ```php
  <?php
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $DB;

  var_dump($DB->TableExists(UserTable::getTableName()));
  ```

{% endlist %}

## Смотрите также

- [Connection::getTableFields](get-table-fields.md)
- [Connection::createTable](create-table.md)
