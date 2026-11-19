---
title: Получить параметры шаблона маршрута Route::getParameters
description: Метод Route::getParameters возвращает имена параметров шаблона маршрута и их регулярные выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getParameters` возвращает параметры шаблона маршрута и их регулярные выражения. Метод [compile](compile.md) заполняет список. Метод [getParametersValues](get-parameters-values.md) возвращает значения параметров из пути запроса.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getParameters()
```

## Возвращаемое значение

Метод возвращает массив. Ключи — имена параметров, значения — регулярные выражения, например `['code' => '[^/]+']`. Для шаблона без параметров после `compile` метод возвращает пустой массив.

До вызова `compile` метод возвращает `null`. Метод не вызывает `compile` сам.

## Примеры

**Пример.** Код строит выражение маршрута и выводит параметры шаблона:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[a-z]+');

$route = new Route('/units/{code}/{page}/', static fn() => 'unit');
$route->setOptions($options);
$route->compile();

var_export($route->getParameters());
```

Код выведет:

```text
array (
  'code' => '[a-z]+',
  'page' => '[^/]+',
)
```

## Смотрите также

- [Route::compile](compile.md)
- [Route::getParametersValues](get-parameters-values.md)
