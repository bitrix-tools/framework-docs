---
title: Добавить отладочные данные Event::addDebugInfo
description: Метод Event::addDebugInfo добавляет элемент в отладочные данные события, если включен режим отладки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::addDebugInfo` добавляет элемент в отладочные данные события. Класс `EventManager` вызывает метод два-три раза для каждого обработчика. Если режим отладки выключен, метод ничего не делает.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function addDebugInfo($ar)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ar\* | `mixed` | Задает данные, например массив или строку |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет отладочные данные до и после включения режима отладки:

```php
<?php
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnUnitAdd');
$event->addDebugInfo('before debug');
$event->turnDebugOn();
$event->addDebugInfo('after debug');

echo implode(', ', $event->getDebugInfo());
```

Код выведет `after debug`.

## Смотрите также

- [Event::getDebugInfo](get-debug-info.md)
