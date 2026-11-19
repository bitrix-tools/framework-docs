---
title: Получить параметр по ключу Event::getParameter
description: Метод Event::getParameter возвращает параметр события по ключу или null, если параметра нет.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getParameter` возвращает параметр события по ключу. Обработчик, который получает объект события, читает параметры этим методом.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getParameter($key)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` или `int` | Задает ключ параметра |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает значение параметра или `null`, если параметра нет. Для параметра со значением `null` метод тоже возвращает `null`. Чтобы различить эти случаи, проверьте ключ в массиве [getParameters](get-parameters.md) функцией `array_key_exists`.

Если параметры заданы замыканием, метод сначала вызывает его.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Замыкание с параметрами вернуло не массив |

## Примеры

**Пример.** Обработчик читает параметр события и возвращает результат с данными:

```php
<?php
use Bitrix\Main\Event;
use Bitrix\Main\EventManager;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

EventManager::getInstance()->addEventHandler(
    'vendor.units',
    'OnUnitAdd',
    static function (Event $event)
    {
        $code = (string)$event->getParameter('code');

        return new EventResult(EventResult::SUCCESS, ['title' => mb_strtoupper($code)]);
    }
);

$event = new Event('vendor.units', 'OnUnitAdd', ['code' => 'kg']);
$event->send();

echo $event->getResults()[0]->getParameters()['title'];
```

Код выведет `KG`.

## Смотрите также

- [Event::getParameters](get-parameters.md)
- [Event::setParameter](set-parameter.md)
