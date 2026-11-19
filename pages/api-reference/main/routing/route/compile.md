---
title: Построить регулярное выражение маршрута Route::compile
description: Метод Route::compile строит по шаблону маршрута регулярное выражение с именованными группами для параметров.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::compile` строит по шаблону маршрута регулярное выражение, по которому метод [match](match.md) проверяет путь. Каждый параметр шаблона становится именованной группой. Метод [Router::route](../router/route.md) вызывает `compile` сам, метод `match` — для шаблона с параметрами.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function compile()
```

## Возвращаемое значение

Метод ничего не возвращает. Результат возвращают методы [getParameters](get-parameters.md) и [getCompileCache](get-compile-cache.md).

Метод выбирает регулярное выражение для параметра в таком порядке:

1. Выражение из метода `where` в настройках маршрута.
2. Выражение `[^/]*`, если у параметра есть значение по умолчанию. Такой параметр может быть пустым.
3. Выражение `[^/]+` в остальных случаях.

Например, шаблон `/units/{code}/` без настроек дает выражение `#^/units/(?<code>[^/]+)/$#`.

## Особенности

- Метод строит выражение один раз. Повторный вызов ничего не делает, даже если настройки маршрута изменились.
- Метод не экранирует символы шаблона вне параметров. Точка в шаблоне совпадает с любым символом.

## Примеры

**Пример.** Код строит выражение для маршрута, у параметра которого есть значение по умолчанию:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->default('page', '1');

$route = new Route('/units/{page}/', static fn() => 'units');
$route->setOptions($options);
$route->compile();

echo $route->getCompileCache()['matchUri'];
```

Код выведет `#^/units/(?<page>[^/]*)/$#`.

## Смотрите также

- [Route::getParameters](get-parameters.md)
- [Route::getCompileCache](get-compile-cache.md)
- [Роутинг](../../../../framework/routing.md#parameter-patterns)
