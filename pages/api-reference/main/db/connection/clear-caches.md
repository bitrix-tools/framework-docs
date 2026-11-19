---
title: Очистить кеш колонок Connection::clearCaches
description: Метод Connection::clearCaches очищает кеш описания колонок, который заполняет getTableFields.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::clearCaches` очищает кеш описания колонок в объекте соединения. Метод [getTableFields](get-table-fields.md) заполняет этот кеш. Вызывайте `clearCaches` после того, как код изменил структуру таблицы своим запросом, например `ALTER TABLE ... ADD COLUMN`.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function clearCaches(?string $table = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| table | `string`, `null` | Задает имя таблицы, кеш которой нужно очистить. По умолчанию — `null`, метод очищает кеш всех таблиц |

## Возвращаемое значение

Метод ничего не возвращает. Метод не обращается к базе данных.

## Примеры

**Пример.** Код добавляет колонку запросом и очищает кеш, чтобы `getTableFields` вернул новую колонку:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL)');

try
{
    $connection->getTableFields('demo_api_status');

    $connection->queryExecute('ALTER TABLE demo_api_status ADD COLUMN STATUS VARCHAR(20)');
    $connection->clearCaches('demo_api_status');

    print_r(array_keys($connection->getTableFields('demo_api_status')));
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::getTableFields](get-table-fields.md)
