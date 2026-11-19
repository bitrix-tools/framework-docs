---
title: Получить исключения обработчиков Event::getExceptions
description: Метод Event::getExceptions возвращает исключения, которые выбросили обработчики события в режиме отладки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getExceptions` возвращает исключения обработчиков. Класс `EventManager` сохраняет исключения в событии, только если метод [turnDebugOn](turn-debug-on.md) включил режим отладки. Без режима отладки первое исключение прерывает отправку.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getExceptions()
```

## Возвращаемое значение

Метод возвращает массив объектов `\Exception` в порядке, в котором их выбросили обработчики. Если исключений нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код отправляет событие в режиме отладки и выводит сообщения исключений:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\SystemException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function ()
    {
        throw new SystemException('Unit storage is not available');
    }
);

$event = new Event('vendor.units', 'OnUnitAdd');
$event->turnDebugOn();
$event->send();

foreach ($event->getExceptions() as $exception)
{
    echo $exception->getMessage();
}
```

Код выведет `Unit storage is not available`.

## Смотрите также

- [Event::addException](add-exception.md)
- [Event::turnDebugOn](turn-debug-on.md)
