---
title: Записать параметр по ключу Event::setParameter
description: Метод Event::setParameter записывает параметр события по ключу. Обработчики, которые получают объект события, видят изменение.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::setParameter` записывает параметр события по ключу. Если параметры заданы замыканием, метод сначала вызывает его, а затем меняет полученный массив.

Обработчики, которые получают объект события, получают один и тот же объект. Поэтому следующие обработчики и код, который отправил событие, видят параметр, который изменил обработчик.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function setParameter($key, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` или `int` | Задает ключ параметра |
| value\* | `mixed` | Задает значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Замыкание с параметрами вернуло не массив |

## Примеры

**Пример.** Обработчик меняет параметр, и код читает новое значение после отправки:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnBeforeUnitAdd',
    static function (Event $event)
    {
        $event->setParameter('code', mb_strtolower((string)$event->getParameter('code')));
    }
);

$event = new Event('vendor.units', 'OnBeforeUnitAdd', ['code' => 'KG']);
$event->send();

echo $event->getParameter('code');
```

Код выведет `kg`.

## Смотрите также

- [Event::getParameter](get-parameter.md)
- [Event::setParameters](set-parameters.md)
