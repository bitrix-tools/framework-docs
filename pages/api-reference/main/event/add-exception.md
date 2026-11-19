---
title: Добавить исключение обработчика Event::addException
description: Метод Event::addException добавляет исключение в список исключений события.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::addException` добавляет исключение в список исключений события. Класс `EventManager` вызывает метод в режиме отладки, когда обработчик выбросил исключение. Метод не проверяет режим отладки.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function addException(\Exception $exception)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| exception\* | `\Exception` | Задает исключение. Метод не принимает объекты `\Error` |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код добавляет исключение в событие без отправки:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\SystemException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnUnitAdd');
$event->addException(new SystemException('Manual check failed'));

echo count($event->getExceptions());
```

Код выведет `1`.

## Смотрите также

- [Event::getExceptions](get-exceptions.md)
