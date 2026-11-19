---
title: Получить все параметры Event::getParameters
description: Метод Event::getParameters возвращает массив параметров события. Если параметры заданы замыканием, метод сначала вызывает его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Event::getParameters` возвращает все параметры события массивом. Если параметры заданы замыканием, метод вызывает его при первом обращении и запоминает результат.

Класс `EventManager` передает значения этого массива обработчику в режиме совместимости отдельными аргументами по порядку, после аргументов из `TO_METHOD_ARG` регистрации обработчика.

Сигнатура метода в классе `Bitrix\Main\Event`:

```php
public function getParameters()
```

## Возвращаемое значение

Метод возвращает массив параметров. Если параметров нет, метод возвращает пустой массив.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Замыкание с параметрами вернуло не массив |

## Примеры

**Пример.** Код создает событие с параметрами из замыкания и выводит их:

```php
<?php
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$event = new Event('vendor.units', 'OnUnitAdd', static function ()
{
    return ['code' => 'kg', 'sort' => 10];
});

echo json_encode($event->getParameters());
```

Код выведет `{"code":"kg","sort":10}`.

## Смотрите также

- [Event::getParameter](get-parameter.md)
- [Event::setParameters](set-parameters.md)
