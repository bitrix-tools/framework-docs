---
title: Получить идентификатор узла Connection::getNodeId
description: Метод Connection::getNodeId возвращает идентификатор узла кластера, заданный для соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.1

{% endnote %}

Метод `Connection::getNodeId` возвращает идентификатор узла кластера, который задан через [setNodeId](set-node-id.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getNodeId()
```

## Возвращаемое значение

Метод возвращает значение, переданное в `setNodeId`. Если идентификатор не задан, метод возвращает `0`.

## Примеры

**Пример.** Код выводит идентификатор узла соединения по умолчанию:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getNodeId());
```

## Смотрите также

- [Connection::setNodeId](set-node-id.md)
