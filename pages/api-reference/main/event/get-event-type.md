---
title: Получить имя события Event::getEventType
description: Метод Event::getEventType возвращает имя события, например OnUnitAdd.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getEventType` возвращает имя события, которое передали в конструктор. Метод нужен обработчику, который подписан на несколько событий одной функцией.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getEventType()
```

## Возвращаемое значение

Метод возвращает строку в том виде, в котором ее передали в конструктор. Класс `EventManager` ищет обработчики без учета регистра имени, а метод возвращает имя с исходным регистром.

## Примеры

**Пример.** Одна функция обрабатывает два события и выбирает действие по имени события:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$handler = static function (Event $event)
{
    echo $event->getEventType() === 'OnUnitAdd' ? 'added ' : 'deleted ';
};

$eventManager = EventManager::getInstance();
$eventManager->addEventHandler('vendor.units', 'OnUnitAdd', $handler);
$eventManager->addEventHandler('vendor.units', 'OnUnitDelete', $handler);

(new Event('vendor.units', 'OnUnitAdd'))->send();
(new Event('vendor.units', 'OnUnitDelete'))->send();
```

Код выведет `added deleted`.

## Смотрите также

- [Event::getModuleId](get-module-id.md)
