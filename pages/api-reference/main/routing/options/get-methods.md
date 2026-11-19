---
title: Получить HTTP-методы маршрута Options::getMethods
description: Метод Routing\Options::getMethods возвращает список HTTP-методов маршрута.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getMethods` возвращает HTTP-методы, на которые отвечает маршрут.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function getMethods()
```

## Возвращаемое значение

Метод возвращает массив HTTP-методов. Если HTTP-методы не заданы, метод возвращает пустой массив, и маршрут отвечает на любой HTTP-метод. Например, список пуст у маршрута, который объявлен методом конфигуратора `any`.

## Примеры

**Пример.** Код объявляет маршрут методом `get` и выводит его HTTP-методы:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes->get('/units/', static fn() => 'units');
$router->releaseRoutes();

echo implode(',', $router->getRoutes()[0]->getOptions()->getMethods());
```

Код выведет `GET,HEAD`.

## Смотрите также

- [Options::methods](methods.md)
