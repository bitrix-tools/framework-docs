---
title: Добавить результат обработчика Event::addResult
description: Метод Event::addResult добавляет объект EventResult в список результатов события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::addResult` добавляет результат в конец списка результатов события. Класс `EventManager` вызывает метод для значения каждого обработчика. Обработчик не вызывает метод, а возвращает `EventResult`.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function addResult(EventResult $result)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| result\* | `Bitrix\Main\EventResult` | Задает результат |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет результат в событие без отправки, например для теста кода, который читает результаты:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnBeforeUnitAdd');
$event->addResult(new EventResult(EventResult::ERROR, ['message' => 'Empty code']));

echo count($event->getResults()) . ' ' . $event->getResults()[0]->getParameters()['message'];
```

Код выведет `1 Empty code`.

## Смотрите также

- [Event::getResults](get-results.md)
- [EventResult](../event-result/index.md)
