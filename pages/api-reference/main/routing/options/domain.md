---
title: Задать домен Options::domain
description: Метод Routing\Options::domain сохраняет домен в настройках маршрута. Ядро значение не использует.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::domain` сохраняет домен в настройках маршрута. У класса нет метода, который читает значение. Маршрутизатор не проверяет домен при поиске маршрута.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function domain($domain)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| domain\* | `string` | Задает домен |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Домен из настроек группы не переходит к ее маршрутам. Чтобы маршрут отвечал только на одном домене, проверьте домен в обработчике маршрута.

## Примеры

**Пример.** Код задает домен маршруту в конфигурации и проверяет домен в обработчике:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->domain('units.example.com')
    ->get('/units/', static function ()
    {
        return Context::getCurrent()->getRequest()->getHttpHost() === 'units.example.com' ? 'units' : 'not found';
    })
;
$router->releaseRoutes();

echo count($router->getRoutes());
```

Код выведет `1`.

## Смотрите также

- [Роутинг](../../../../framework/routing.md)
