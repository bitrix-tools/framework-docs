---
title: Зарегистрировать обработчик предпросмотра Router::setRouteHandler
description: Метод UrlPreview\Router::setRouteHandler регистрирует или изменяет обработчик предпросмотра для шаблона внутреннего адреса и сохраняет его в базе данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::setRouteHandler` регистрирует класс-обработчик предпросмотра для шаблона адреса. Если шаблон уже зарегистрирован, метод заменяет его обработчик. Метод сохраняет маршрут в базе данных и очищает кеш маршрутов.

Сигнатура метода в классе `Bitrix\Main\UrlPreview\Router`:

```php
public static function setRouteHandler($route, $handlerModule, $handlerClass, array $handlerParameters)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| route\* | `string` | Задает шаблон адреса. Параметры адреса заключают в символы `#`, например `/units/#unitCode#/` |
| handlerModule\* | `string` | Задает код модуля обработчика. Перед вызовом обработчика `UrlPreview` подключает этот модуль |
| handlerClass\* | `string` | Задает имя класса обработчика |
| handlerParameters\* | `array` | Задает параметры для методов обработчика. Метод `dispatch` заменяет значение со знаком `$` в начале, например `'$unitCode'`, значением параметра адреса с таким именем. Ключ `allowSlashes` со значением `Y` разрешает символ `/` в значениях параметров адреса |

Типы `route`, `handlerModule` и `handlerClass` в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | `route`, `handlerModule` или `handlerClass` — пустая строка или не строка |

## Особенности

Если шаблон уже зарегистрирован с тем же модулем, классом и параметрами, метод ничего не меняет и не записывает в базу данных.

## Примеры

**Пример.** Код регистрирует обработчик для адресов единиц измерения и находит обработчик для адреса. В блоке `finally` код удаляет маршрут из базы данных и очищает кеш:

```php
<?php
use Bitrix\Main\UrlPreview\RouteTable;
use Bitrix\Main\UrlPreview\Router;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$routeTemplate = '/demo/units/#unitCode#/';

try
{
    Router::setRouteHandler(
        $routeTemplate,
        'main',
        '\Demo\Preview\UnitPreview',
        ['unitCode' => '$unitCode']
    );

    $handler = Router::dispatch(new Uri('/demo/units/kg/'));
    echo $handler['CLASS'] . ' ' . $handler['PARAMETERS']['unitCode'] . PHP_EOL;
}
finally
{
    $route = RouteTable::getByRoute($routeTemplate);
    if ($route)
    {
        RouteTable::delete($route['ID']);
    }
    Router::invalidateRouteCache();
}
```

Код выведет `\Demo\Preview\UnitPreview kg`.

## Смотрите также

- [Router::dispatch](dispatch.md)
- [Router::invalidateRouteCache](invalidate-route-cache.md)
