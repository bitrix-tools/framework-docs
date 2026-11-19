---
title: Получить обработчик маршрута Route::getController
description: Метод Route::getController возвращает обработчик маршрута, переданный в конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getController` возвращает обработчик маршрута в том виде, в котором его передали в конструктор.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getController()
```

## Возвращаемое значение

Метод возвращает обработчик. Вид значения зависит от объявления маршрута:

- замыкание `\Closure`,
- массив из имени класса контроллера и имени действия, например `[UnitController::class, 'view']`,
- строка с именем класса действия, которое реализует интерфейс `Bitrix\Main\Engine\Contract\RoutableAction`,
- объект `Bitrix\Main\Routing\Controllers\PublicPageController` для публичной страницы.

Файл `/bitrix/routing_index.php` вызывает обработчик по его виду. Для обработчика другого вида файл выбрасывает исключение `Bitrix\Main\SystemException`.

## Примеры

**Пример.** Код объявляет маршрут на действие контроллера и выводит обработчик:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;
use Example\Units\Controller\Unit;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes->get('/units/{code}/', [Unit::class, 'view']);
$router->releaseRoutes();

echo implode('::', $router->getRoutes()[0]->getController());
```

Класс `Example\Units\Controller\Unit` — условный контроллер модуля. Маршрутизатор не загружает класс при объявлении маршрута. Код выведет `Example\Units\Controller\Unit::view`.

## Смотрите также

- [Route::__construct](construct.md)
- [Роутинг](../../../../framework/routing.md#route-handlers)
