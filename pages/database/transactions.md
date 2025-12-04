---
title: Транзакции
description: 'Транзакции. Работа с базой данных в Bitrix: лучшие практики, инструкция и примеры запросов.'
---

Транзакция -- это набор операций с базой данных, которые выполняются как единое целое: либо выполняются все операции, либо не выполняется ни одной. Это гарантирует целостность данных, даже если несколько процессов работают с базой одновременно.

## Когда использовать транзакции

-  При сложных изменениях данных, которые состоят из нескольких операций.

-  Когда важно, чтобы другие процессы не видели промежуточные результаты.

## Как работать с транзакциями

{% note warning "" %}

Делайте транзакции короткими. Долгие транзакции увеличивают риск взаимных блокировок, каскадных откатов и аварийного завершения операций.

{% endnote %}

Используйте объект [`Bitrix\Main\DB\Connection`](https://docs.1c-bitrix.ru/api/classes/Bitrix-Main-DB-Connection.html). Внутри транзакции можно выполнять SQL-запросы или работать с ORM:

```php
$db = \Bitrix\Main\Application::getConnection();

try {
    $db->startTransaction();

    // Пример SQL-запроса
    $db->queryExecute(
		"UPDATE my_table SET active = '".\$db->getSqlHelper()->forSql('N')."' WHERE age > ".(int)0
	);

    // Пример изменения через ORM
    \Bitrix\Main\SiteTable::update('s1', ['ACTIVE' => 'N']);

    $db->commitTransaction();
} catch (Throwable $e) {
    $db->rollbackTransaction();
    throw $e;
}
```

-  `startTransaction()` -- начинает новую транзакцию. Все последующие операции будут частью этой транзакции до ее завершения.

-  `commitTransaction()` -- подтверждает транзакцию, применяя все изменения в базе данных. Если транзакция успешна, данные сохраняются.

-  `rollbackTransaction()` -- отменяет транзакцию, отменяя все изменения, сделанные в ее рамках. Используется при ошибках для возврата в исходное состояние.

{% note warning "" %}

Если ORM-объект переопределяет соединение через `DataManager::getConnectionName`, то транзакция будет работать только в рамках этого соединения.

{% endnote %}

## Особенности вложенных транзакций

Можно вызывать транзакции внутри других транзакций. В этом случае:

-  `startTransaction()` внутри другой транзакции создает точку сохранения -- `SAVEPOINT`,

-  `commitTransaction()` во вложенной транзакции ничего не сохраняет в БД -- сохранение происходит при коммите внешней транзакции,

-  `rollbackTransaction()` делает частичный откат до точки сохранения и выбрасывает исключение `TransactionException`.

Что может произойти дальше:

-  если исключение не поймано -- скрипт упадет, MySQL откатит все изменения,

-  если вы поймали исключение и решили продолжить -- изменения из внешней транзакции могут быть сохранены,

-  если вы решили откатить и сами находитесь во вложенной транзакции -- процесс повторится на уровень выше.

{% note warning "" %}

Избегайте откатов во вложенных транзакциях. Это усложняет логику. Условия отката должен определять код основной транзакции.

{% endnote %}

### Как обрабатывать ошибки во вложенных транзакциях

Если вложенная транзакция завершилась с ошибкой:

1. откатите основную транзакцию полностью -- `rollbackTransaction`,

2. решите, как следует обработать ошибку -- залогировать, повторить операцию или выполнить другие действия.

```php
use Bitrix\Main\Application;
use Bitrix\Main\DB\Connection;
use Bitrix\Main\DB\SqlExpression;
use Bitrix\Main\DB\TransactionException;

// Функция обновления счетов
function updateAccounts(int $userId, Connection $db) {
    try {
        $db->startTransaction();
        // Ваш код изменения данных
        $db->commitTransaction();
    } catch (Throwable $e) {
        $db->rollbackTransaction();
        throw $e;
    }
}

// Функция обновления заказов
function updateOrders(int $userId, Connection $db) {
    try {
        $db->startTransaction();
        // Ваш SQL-запрос
        $db->commitTransaction();
    } catch (Throwable $e) {
        $db->rollbackTransaction();
        throw $e;
    }
}

// Основная транзакция
$db = Application::getConnection();

try {
    $db->startTransaction();
    
    updateOrders($userId, $db);    // Вложенная транзакция
    updateAccounts($userId, $db);  // Вложенная транзакция
    
    $db->commitTransaction();
} catch (TransactionException $e) {
    // Если ошибка во вложенной транзакции
    $db->rollbackTransaction();  // Откатываем все
} catch (Throwable $e) {
    $db->rollbackTransaction();
    throw $e;
}
```
