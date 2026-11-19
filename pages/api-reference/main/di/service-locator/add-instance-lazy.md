---
title: Зарегистрировать сервис с отложенным созданием ServiceLocator::addInstanceLazy
description: Метод ServiceLocator::addInstanceLazy регистрирует сервис по описанию, а метод get создает объект сервиса при первом вызове.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::addInstanceLazy` регистрирует сервис по описанию. Метод [get](get.md) создаст объект сервиса при первом обращении. Описание имеет тот же формат, что и элемент секции `services` в `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public function addInstanceLazy(string $id, $configuration): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает код сервиса или имя интерфейса |
| configuration\* | `array` | Задает описание сервиса. Ключи перечислены в таблице ниже |

Тип `configuration` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

#|
|| Ключ | Описание ||
|| className<br>`string` | Содержит имя класса сервиса ||
|| constructor<br>`Closure` | Содержит функцию, которая возвращает объект сервиса. Метод `get` вызывает функцию, если нет `className` ||
|| constructorParams<br>`array`, `Closure` | Содержит аргументы конструктора `className` или функцию, которая их возвращает. Для кода-интерфейса или абстрактного класса метод `get` передает массив аргументов в функцию `constructor`, а в `className` аргументы не передает ||
|| singleton<br>`bool` | Создает новый объект при каждом вызове `get`, если равен `false`. По умолчанию метод `get` создает объект один раз ||
|#

Один из ключей `className` или `constructor` обязателен. Если указаны оба, метод использует `className`.

Новое описание под тем же кодом заменяет старое. Объект, который `get` уже создал или который добавлен через `addInstance`, при этом остается, и `get` вернет его. Признак `singleton => false` из старого описания тоже остается.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DI\Exception\RegistrationException` | В описании нет ни `className`, ни `constructor` |

## Примеры

**Пример.** Код регистрирует сервис с функцией-конструктором и получает его:

```php
<?php
use Bitrix\Main\DI\ServiceLocator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$locator = ServiceLocator::getInstance();

$locator->addInstanceLazy('demo.unitTitles', [
    'constructor' => static function (): ArrayObject
    {
        return new ArrayObject(['kg' => 'Kilogram', 'm' => 'Meter']);
    },
]);

echo $locator->get('demo.unitTitles')['kg'];
```

## Смотрите также

- [ServiceLocator::get](get.md)
- [ServiceLocator::addInstance](add-instance.md)
- [Сервис-локатор](../../../../framework/service-locator.md)
