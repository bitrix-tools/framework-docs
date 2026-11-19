---
title: Задать имя маршрута Options::name
description: Метод Routing\Options::name задает имя маршрута или часть имени, которую группа добавляет к именам своих маршрутов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::name` задает имя маршрута. Для группы метод задает часть имени, которую группа добавляет перед именами своих маршрутов. Метод [Router::route](../router/route.md) строит URL по полному имени.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function name($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя, например `unit.view`. Имя группы завершайте точкой, например `api.`. Метод `getFullName` соединяет имена без разделителя |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает и заменяет собственное имя. Метод не меняет имена родительских групп, которые добавил [mergeWith](merge-with.md).

## Примеры

**Пример.** Код объявляет группу с именем и маршрут в ней и выводит полное имя маршрута:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->name('api.')
    ->group(static function (RoutingConfigurator $routes)
    {
        $routes->get('units/', static fn() => 'units')->name('units');
    })
;
$router->releaseRoutes();

echo $router->getRoutes()[0]->getOptions()->getFullName();
```

Код выведет `api.units`.

## Смотрите также

- [Options::getFullName](get-full-name.md)
- [Роутинг](../../../../framework/routing.md#group-names)
