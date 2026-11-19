---
title: Получить отладочные данные Event::getDebugInfo
description: Метод Event::getDebugInfo возвращает данные, которые EventManager записал о каждом обработчике в режиме отладки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getDebugInfo` возвращает отладочные данные события. Класс `EventManager` записывает их, только если метод [turnDebugOn](turn-debug-on.md) включил режим отладки.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getDebugInfo()
```

## Возвращаемое значение

Метод возвращает массив. Без режима отладки массив пустой.

Для каждого обработчика `EventManager` добавляет элементы по порядку:

1. Массив с описанием обработчика. У обработчика из `addEventHandler` в нем есть ключи `FROM_MODULE_ID`, `MESSAGE_ID`, `CALLBACK`, `SORT` и `VERSION`. У обработчика из `registerEventHandler` — ключи `TO_MODULE_ID`, `TO_CLASS`, `TO_METHOD`, `TO_PATH`, `SORT` и `VERSION`.
2. Результат подключения модуля обработчика. Значение `false` бывает, только если модуль обработчика — не `main` и не подключился. В остальных случаях элемент равен `true`.
3. Значение обработчика после обработки. Непустое значение другого типа, кроме `EventResult`, класс заворачивает в `EventResult`. Элемент появляется, только если модуль подключился и обработчик не выбросил исключение.

## Примеры

**Пример.** Код отправляет событие в режиме отладки и выводит, сколько элементов записал `EventManager`:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function ()
    {
        return 'handled';
    }
);

$event = new Event('vendor.units', 'OnUnitAdd');
$event->turnDebugOn();
$event->send();

$debugInfo = $event->getDebugInfo();

echo count($debugInfo) . ' ' . $debugInfo[0]['MESSAGE_ID'];
```

Код выведет `3 OnUnitAdd`.

## Смотрите также

- [Event::addDebugInfo](add-debug-info.md)
- [Event::turnDebugOn](turn-debug-on.md)
