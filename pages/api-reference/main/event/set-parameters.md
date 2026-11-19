---
title: Заменить все параметры Event::setParameters
description: Метод Event::setParameters заменяет параметры события массивом или замыканием, которое вернет массив при первом чтении.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::setParameters` заменяет все параметры события. Конструктор вызывает этот метод для параметров из аргумента.

Замыкание готовит параметры только при первом обращении к ним. Событие вызывает замыкание, когда код или обработчик читает или записывает параметр. Класс `EventManager` вызывает замыкание и сам, если среди обработчиков есть обработчик в режиме совместимости.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function setParameters($parameters)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameters\* | `array` или `\Closure` | Задает параметры массивом или замыканием, которое вернет массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Аргумент `parameters` — не массив и не замыкание |

## Примеры

**Пример.** Код задает параметры замыканием и показывает, что событие вызывает замыкание один раз при первом чтении:

```php
<?php
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$calls = 0;

$event = new Event('vendor.units', 'OnUnitAdd');
$event->setParameters(static function () use (&$calls)
{
    $calls++;

    return ['code' => 'kg'];
});

echo $calls . ' ';
echo $event->getParameter('code') . ' ' . $event->getParameter('code') . ' ';
echo $calls;
```

Код выведет `0 kg kg 1`.

## Смотрите также

- [Event::getParameters](get-parameters.md)
- [Event::setParameter](set-parameter.md)
