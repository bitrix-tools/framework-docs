---
title: Задать идентификатор узла Connection::setNodeId
description: Метод Connection::setNodeId задает идентификатор узла кластера, который соединение передает в сведения о запросах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.1

{% endnote %}

Метод `Connection::setNodeId` задает идентификатор узла кластера для соединения. Если включено отслеживание через [startTracker](start-tracker.md), метод [query](query.md) записывает в сведения о запросе идентификатор соединения, которое выполнило запрос. Для запроса на реплике это идентификатор реплики, его задает пул соединений.

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function setNodeId($nodeId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| nodeId\* | `string`, `int` | Задает идентификатор узла. Метод сохраняет значение без проверки |

Типы в таблице описывают назначение аргумента. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает идентификатор узла и читает его обратно:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$previousNodeId = $connection->getNodeId();

try
{
    $connection->setNodeId('node-2');
    echo $connection->getNodeId();
}
finally
{
    $connection->setNodeId($previousNodeId);
}
```

## Смотрите также

- [Connection::getNodeId](get-node-id.md)
- [Connection::startTracker](start-tracker.md)
