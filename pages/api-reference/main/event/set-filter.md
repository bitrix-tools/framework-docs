---
title: Задать фильтр модулей обработчиков Event::setFilter
description: Метод Event::setFilter задает коды модулей, обработчики которых вызовет событие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::setFilter` задает коды модулей, обработчики которых вызовет событие. Фильтр нужен, когда событие предназначено обработчикам одного или нескольких модулей, а не всем обработчикам.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function setFilter($filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `string`, `array` или `null` | Задает код модуля или массив кодов. Пустое значение снимает фильтр |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Класс `EventManager` сравнивает фильтр с кодом модуля обработчика из `registerEventHandler` с учетом регистра. У обработчиков, которые добавил метод [addEventHandler](../event-manager/add-event-handler.md), нет кода модуля, поэтому событие с фильтром их не вызывает.
- Пустая строка, `null` и другие пустые значения снимают фильтр, и [getFilter](get-filter.md) возвращает `null`. Пустой массив метод сохраняет, но он тоже не ограничивает обработчики.

## Примеры

**Пример.** Код отправляет событие с фильтром и без него обработчику, добавленному методом `addEventHandler`:

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

$all = new Event('vendor.units', 'OnUnitAdd');
$all->send();

$filtered = new Event('vendor.units', 'OnUnitAdd');
$filtered->setFilter('vendor.catalog');
$filtered->send();

echo count($all->getResults()) . ' ' . count($filtered->getResults());
```

Код выведет `1 0`.

## Смотрите также

- [Event::getFilter](get-filter.md)
- [EventManager::registerEventHandler](../event-manager/register-event-handler.md)
