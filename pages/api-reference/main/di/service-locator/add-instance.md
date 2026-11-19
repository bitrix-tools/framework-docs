---
title: Зарегистрировать готовый объект ServiceLocator::addInstance
description: Метод ServiceLocator::addInstance регистрирует готовый объект сервиса под заданным кодом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::addInstance` регистрирует готовый объект сервиса под заданным кодом. Метод [get](get.md) возвращает этот объект без создания нового. Объект под тем же кодом метод заменяет.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public function addInstance(string $code, mixed $service): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` | Задает код сервиса или имя интерфейса |
| service\* | `mixed` | Задает объект сервиса |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код регистрирует объект и получает его по коду:

```php
<?php
use Bitrix\Main\DI\ServiceLocator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$locator = ServiceLocator::getInstance();
$unitTitles = new ArrayObject(['kg' => 'Kilogram']);

$locator->addInstance('demo.unitTitles', $unitTitles);

var_dump($locator->get('demo.unitTitles') === $unitTitles);
```

## Смотрите также

- [ServiceLocator::addInstanceLazy](add-instance-lazy.md)
