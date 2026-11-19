---
title: Получить идентификатор добавленной строки Connection::getInsertedId
description: Метод Connection::getInsertedId возвращает значение автоинкремента, сгенерированное последним запросом INSERT.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Connection::getInsertedId` возвращает значение автоинкремента, которое база данных сгенерировала для последней добавленной строки. Метод [add](add.md) в MySQL вызывает его сам, в PostgreSQL получает идентификатор другим способом. Аналог в классическом API — `CDatabase::LastID`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function getInsertedId();
```

## Возвращаемое значение

Метод возвращает целое число `int`. Источник значения зависит от реализации.

| Реализация | Источник значения |
| --- | --- |
| `MysqliConnection` | Свойство `insert_id` объекта `mysqli`. Метод подключается к базе данных, если подключения еще нет |
| `PgsqlConnection` | Запрос `SELECT bx_lastval()`. Если запрос завершился ошибкой, метод возвращает `0` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

{% list tabs %}

- D7

  **Пример.** Код добавляет строку запросом `INSERT` и выводит ее идентификатор. Блок `finally` удаляет рабочую таблицу:

  ```php
  <?php
  use Bitrix\Main\Application;
  use Bitrix\Main\ORM\Fields\IntegerField;
  use Bitrix\Main\ORM\Fields\StringField;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $connection = Application::getConnection();

  $connection->createTable(
      'demo_api_units',
      ['ID' => new IntegerField('ID'), 'CODE' => new StringField('CODE', ['size' => 20])],
      ['ID'],
      ['ID']
  );

  try
  {
      $connection->queryExecute("INSERT INTO demo_api_units (CODE) VALUES ('kg')");
      echo $connection->getInsertedId();
  }
  finally
  {
      $connection->dropTable('demo_api_units');
  }
  ```

- Классический API

  **Пример.** Код получает тот же идентификатор через `CDatabase::LastID` после добавления строки:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $DB;

  $DB->Query('CREATE TABLE demo_api_units (ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, CODE VARCHAR(20))');

  try
  {
      $DB->Query("INSERT INTO demo_api_units (CODE) VALUES ('kg')");
      echo $DB->LastID();
  }
  finally
  {
      $DB->Query('DROP TABLE demo_api_units');
  }
  ```

{% endlist %}

## Смотрите также

- [Connection::add](add.md)
- [Connection::addMulti](add-multi.md)
