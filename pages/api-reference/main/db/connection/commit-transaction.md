---
title: Зафиксировать транзакцию Connection::commitTransaction
description: Метод Connection::commitTransaction уменьшает уровень вложенности транзакций и фиксирует транзакцию на внешнем уровне.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::commitTransaction` уменьшает уровень вложенности транзакций на единицу. Метод выполняет запрос `COMMIT`, только когда уровень становится равен нулю. Аналог в классическом API — `CDatabase::Commit`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function commitTransaction();
```

## Возвращаемое значение

Метод ничего не возвращает.

Во вложенной транзакции метод не выполняет запросов. Изменения фиксирует только `commitTransaction` внешнего уровня. Реализации MySQL и PostgreSQL ведут себя одинаково.

{% note warning "" %}

Вызов без начатой транзакции выбрасывает `TransactionException` и оставляет уровень вложенности отрицательным. Следующий `startTransaction` на этом соединении выполнит `SAVEPOINT` вместо `START TRANSACTION`. Вызывайте `commitTransaction` только в паре со `startTransaction`.

{% endnote %}

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\TransactionException` | Транзакция не начата, уровень вложенности стал меньше нуля |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении `COMMIT` |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код вкладывает одну транзакцию в другую. Строку фиксирует только внешний вызов `commitTransaction`:

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
        $connection->startTransaction();
        try
        {
            $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new')");
        }
        catch (\Throwable $exception)
        {
            $connection->rollbackTransaction();
            throw $exception;
        }
        $connection->commitTransaction();
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

Если во внутреннем блоке возникнет ошибка, в MySQL внутренний `rollbackTransaction` сам выбросит `TransactionException`. Внешний блок перехватит его и откатит всю транзакцию, но наверх уйдет `TransactionException`, а не исходное исключение.

## Смотрите также

- [Connection::startTransaction](start-transaction.md)
- [Connection::rollbackTransaction](rollback-transaction.md)
