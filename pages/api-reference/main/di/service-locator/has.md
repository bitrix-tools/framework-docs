---
title: Проверить наличие сервиса ServiceLocator::has
description: Метод ServiceLocator::has проверяет, зарегистрирован ли сервис с заданным кодом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ServiceLocator::has` проверяет, зарегистрирован ли сервис с заданным кодом.

Сигнатура метода в классе `Bitrix\Main\DI\ServiceLocator`:

```php
public function has(string $id): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает код сервиса |

## Возвращаемое значение

Метод возвращает `true`, если сервис зарегистрирован через `addInstanceLazy`, настройки или `addInstance` либо объект уже создан, иначе `false`.

Для класса без регистрации метод возвращает `false`, хотя [get](get.md) может создать объект такого класса. После первого вызова `get` для этого класса метод возвращает `true`. Объект `null`, добавленный через `addInstance`, метод не учитывает.

## Примеры

**Пример.** Код регистрирует сервис и проверяет его наличие:

```php
<?php
use Bitrix\Main\DI\ServiceLocator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$locator = ServiceLocator::getInstance();

$locator->addInstance('demo.unitFormatter', new ArrayObject());

var_dump($locator->has('demo.unitFormatter'), $locator->has('demo.missing'));
```

## Смотрите также

- [ServiceLocator::get](get.md)
