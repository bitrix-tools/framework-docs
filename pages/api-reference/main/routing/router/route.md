---
title: Построить URL по имени маршрута Router::route
description: Метод Router::route строит URL именованного маршрута и подставляет в него значения параметров.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::route` строит URL маршрута по его имени. Метод подставляет значения в параметры шаблона, а лишние значения добавляет в строку запроса.

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function route($name, $parameters = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает полное имя маршрута. Для маршрута в группе полное имя — имена групп и маршрута без разделителя. Например, группа `blog.` и маршрут `post.view` дают имя `blog.post.view` |
| parameters | `array` | Задает значения параметров маршрута, ключи — имена параметров. Значения, которых нет в шаблоне, попадают в строку запроса. По умолчанию — пустой массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку URL. Если маршрута с таким именем нет, метод возвращает `null`.

Для каждого параметра шаблона метод берет значение из `parameters`, а если его там нет — значение по умолчанию из настроек маршрута. Метод кодирует значение функцией `urlencode` и не проверяет, подходит ли значение под шаблон параметра.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\Routing\Exceptions\ParameterNotFoundException` | Для параметра шаблона не передали значение, и у маршрута нет значения по умолчанию |

## Примеры

**Пример.** Код объявляет именованный маршрут в отдельном маршрутизаторе и строит URL с параметром и строкой запроса:

```php
<?php
use Bitrix\Main\Routing\Router;
use Bitrix\Main\Routing\RoutingConfigurator;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = new Router();
$routes = new RoutingConfigurator();
$routes->setRouter($router);

$routes
    ->get('/units/{code}/', static fn() => 'unit')
    ->name('unit.view')
;
$router->releaseRoutes();

echo $router->route('unit.view', ['code' => 'kg', 'view' => 'short']);
```

Код выведет `/units/kg/?view=short`. Для маршрутов сайта используйте объект `Application::getInstance()->getRouter()`.

## Смотрите также

- [Router::url](url.md)
- [Роутинг](../../../../framework/routing.md)
