---
title: Откатить транзакцию Connection::rollbackTransaction
description: Метод Connection::rollbackTransaction откатывает транзакцию или изменения до точки сохранения вложенной транзакции.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::rollbackTransaction` уменьшает уровень вложенности транзакций на единицу и откатывает изменения. Аналог в классическом API — `CDatabase::Rollback`, он вызывает этот метод.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
abstract public function rollbackTransaction();
```

## Возвращаемое значение

Метод ничего не возвращает.

На внешнем уровне метод выполняет `ROLLBACK`. Во вложенной транзакции метод откатывает изменения до точки сохранения запросом `ROLLBACK TO SAVEPOINT TRANS<номер>`. Номер тот же, что в запросе `SAVEPOINT` из `startTransaction`. Дальше реализации расходятся.

| Реализация | Вложенный откат |
| --- | --- |
| `MysqliConnection` | После отката до точки сохранения выбрасывает `TransactionException` с сообщением `Nested rollbacks are unsupported.` |
| `PgsqlConnection` | Откатывает до точки сохранения без исключения |

В MySQL исключение после вложенного отката поднимается к внешнему коду. Внешний блок должен перехватить его и откатить всю транзакцию.

{% note warning "" %}

Вызов без начатой транзакции выбрасывает `TransactionException` и оставляет уровень вложенности отрицательным. Следующий `startTransaction` на этом соединении выполнит `SAVEPOINT` вместо `START TRANSACTION`. Вызывайте `rollbackTransaction` только в паре со `startTransaction`.

{% endnote %}

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\TransactionException` | Транзакция не начата, уровень вложенности стал меньше нуля. В MySQL — также после отката вложенной транзакции |
| `Bitrix\Main\DB\SqlQueryException` | База данных вернула ошибку при выполнении запроса |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код откатывает транзакцию, если вторая вставка нарушила первичный ключ. Код вызывает `commitTransaction` вне блока `try`, чтобы блок `catch` не откатил транзакцию, если ошибку вернет сам `COMMIT`. В таблице не остается ни одной строки:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();

$connection->queryExecute('CREATE TABLE demo_api_status (ID INT NOT NULL PRIMARY KEY, STATUS VARCHAR(20) NOT NULL)');

try
{
    $failed = false;

    $connection->startTransaction();
    try
    {
        $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'new')");
        $connection->queryExecute("INSERT INTO demo_api_status (ID, STATUS) VALUES (1, 'done')");
    }
    catch (\Throwable $exception)
    {
        $connection->rollbackTransaction();
        $failed = true;
        echo get_class($exception) . PHP_EOL;
    }

    if (!$failed)
    {
        $connection->commitTransaction();
    }

    echo $connection->queryScalar('SELECT COUNT(*) FROM demo_api_status');
}
finally
{
    $connection->dropTable('demo_api_status');
}
```

## Смотрите также

- [Connection::startTransaction](start-transaction.md)
- [Connection::commitTransaction](commit-transaction.md)
- [Транзакции](../../../../database/transactions.md)
