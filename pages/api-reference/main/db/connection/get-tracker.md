---
title: Получить объект отслеживания Connection::getTracker
description: Метод Connection::getTracker возвращает объект SqlTracker со сведениями о запросах соединения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Connection::getTracker` возвращает объект `Bitrix\Main\Diag\SqlTracker` со сведениями о запросах. Метод не включает сбор. Чтобы включить сбор, вызовите [startTracker](start-tracker.md).

Сигнатура метода в классе `Bitrix\Main\DB\Connection`:

```php
public function getTracker()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Diag\SqlTracker` или `null`, если у соединения еще нет объекта отслеживания.

## Примеры

**Пример.** Код выводит число отслеженных запросов, если объект отслеживания есть:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$tracker = Application::getConnection()->getTracker();

echo $tracker === null ? 'Tracking was not started' : $tracker->getCounter();
```

## Смотрите также

- [Connection::startTracker](start-tracker.md)
- [Connection::setTracker](set-tracker.md)
