---
title: Начать транзакцию Connection::startTransaction
description: Метод Connection::startTransaction начинает транзакцию, а при вложенном вызове создает точку сохранения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::startTransaction` начинает транзакцию. Если транзакция уже открыта, метод создает точку сохранения. Аналог в классическом API — `CDatabase::StartTransaction`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function startTransaction();
```

## Возвращаемое значение

Метод ничего не возвращает.

Реализации MySQL и PostgreSQL ведут счетчик уровня вложенности в объекте соединения.

| Уровень до вызова | Запрос |
| --- | --- |
| `0` | `START TRANSACTION` |
| `1` и больше | `SAVEPOINT TRANS<уровень>`, например `SAVEPOINT TRANS1` |

После запроса метод увеличивает уровень на единицу. Каждому вызову `startTransaction` должен соответствовать вызов [commitTransaction](commit-transaction.md) или [rollbackTransaction](rollback-transaction.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код добавляет две строки в одной транзакции. Если любая операция выбросит исключение, транзакция откатится. Код вызывает `commitTransaction` вне блока `try`, чтобы блок `catch` не откатил транзакцию, если ошибку вернет сам `COMMIT`:

  ```php
  <?php
  use Bitrix\Main\Application;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $connection = Application::getConnection();

  $connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');

  try
  {
      $connection->startTransaction();
      try
      {
          $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new')");
          $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (2, 'new')");
      }
      catch (\Throwable $exception)
      {
          $connection->rollbackTransaction();
          throw $exception;
      }
      $connection->commitTransaction();

      echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_status');
  }
  finally
  {
      $connection->dropTable('demo_api_status');
  }
  ```

- Классический API

  **Пример.** Код выполняет ту же схему через методы `CDatabase`. Методы `StartTransaction`, `Commit` и `Rollback` вызывают методы соединения D7:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $DB;

  $DB->Query('CREATE TABLE demo_api_status (ID INT NOT NULL, STATUS VARCHAR(20) NOT NULL)');

  try
  {
      $DB->StartTransaction();
      try
      {
          $DB->Query("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new')");
      }
      catch (\Throwable $exception)
      {
          $DB->Rollback();
          throw $exception;
      }
      $DB->Commit();
  }
  finally
  {
      $DB->Query('DROP TABLE demo_api_status');
  }
  ```

{% endlist %}

## Смотрите также

- [Connection::commitTransaction](commit-transaction.md)
- [Connection::rollbackTransaction](rollback-transaction.md)
- [Транзакции](../../../../database/transactions.md)
