---
title: Заменить маршрутизатор Application::setRouter
description: Метод Application::setRouter заменяет маршрутизатор приложения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::setRouter` заменяет маршрутизатор приложения. Метод [getRouter](get-router.md) вызывает его сам, когда загружает маршруты. Код приложения вызывает метод в тестах, чтобы подставить маршрутизатор со своими маршрутами.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function setRouter(Router $router): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| router\* | `Bitrix\Main\Routing\Router` | Задает маршрутизатор |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

После замены [getRouter](get-router.md) возвращает новый маршрутизатор и не загружает файлы маршрутов.

## Примеры

**Пример.** Код подставляет пустой маршрутизатор:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Routing\Router;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$router = new Router();
$application->setRouter($router);

var_dump($application->getRouter() === $router);
```

Код выведет `bool(true)`.

## Смотрите также

- [Application::getRouter](get-router.md)
- [Router](../routing/router/index.md)
