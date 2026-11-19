---
title: Получить пул соединений Application::getConnectionPool
description: Метод Application::getConnectionPool возвращает пул соединений с базами данных — он создает соединения по настройкам и управляет ими.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Application::getConnectionPool` возвращает пул соединений с базами данных. Пул создает соединения по настройкам из секции `connections` файла `.settings.php` и хранит их до конца запроса. Метод нужен, чтобы управлять соединениями, например при репликации направить запросы только на основной сервер.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getConnectionPool()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Data\ConnectionPool`.

## Особенности

Для одного соединения используйте [getConnection](get-connection.md). Он сам обращается к пулу.

## Примеры

**Пример.** Код получает соединение через пул и сравнивает с результатом `getConnection`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$pool = Application::getInstance()->getConnectionPool();

echo get_class($pool) . ' ' . var_export($pool->getConnection() === Application::getConnection(), true);
```

Код выведет `Bitrix\Main\Data\ConnectionPool true`.

## Смотрите также

- [Application::getConnection](get-connection.md)
- [Репликация и кластеризация](../../../performance/replication-and-clustering.md)
