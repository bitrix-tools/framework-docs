---
title: Задать маршрут запроса Application::setCurrentRoute
description: Метод Application::setCurrentRoute задает маршрут, который совпал с адресом текущего запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::setCurrentRoute` задает маршрут текущего запроса. Файл `/bitrix/modules/main/include/routing_index.php` вызывает метод сам, когда находит маршрут. Код приложения вызывает метод в тестах контроллеров, которые читают параметры маршрута.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function setCurrentRoute(Route $currentRoute): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| currentRoute\* | `Bitrix\Main\Routing\Route` | Задает маршрут |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает маршрут и читает его адрес:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$application->setCurrentRoute(new Route('/units/{id}/', fn() => 'unit'));

echo var_export($application->hasCurrentRoute(), true) . ' ' . $application->getCurrentRoute()->getUri();
```

Код выведет `true /units/{id}/`.

## Смотрите также

- [Application::getCurrentRoute](get-current-route.md)
- [Route](../routing/route/index.md)
