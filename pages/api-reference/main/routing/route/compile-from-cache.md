---
title: Загрузить данные маршрута из кеша Route::compileFromCache
description: Метод Route::compileFromCache задает маршруту регулярное выражение и параметры из данных, которые вернул getCompileCache.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::compileFromCache` задает маршруту регулярное выражение и параметры из кеша вместо вызова [compile](compile.md). Класс `Bitrix\Main\Routing\CompileCache` вызывает метод для каждого маршрута, если в кеше есть данные для текущего набора файлов маршрутов.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function compileFromCache($cacheData)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

#|
|| Параметр | Тип | Описание ||
|| cacheData\* | `array` | Задает данные маршрута в формате результата [getCompileCache](get-compile-cache.md). Ключи:

- `matchUri` — регулярное выражение для проверки пути,
- `parameters` — параметры шаблона и их регулярные выражения ||
|#

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

Метод не проверяет, что данные соответствуют шаблону маршрута. После вызова `compileFromCache` метод `compile` ничего не делает, и метод [match](match.md) проверяет путь по выражению из кеша.

## Примеры

**Пример.** Код переносит построенное выражение из одного маршрута в другой с тем же шаблоном:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$options->where('code', '[0-9]+');

$source = new Route('/units/{code}/', static fn() => 'unit');
$source->setOptions($options);
$cacheData = $source->getCompileCache();

$route = new Route('/units/{code}/', static fn() => 'unit');
$route->setOptions(new Options());
$route->compileFromCache($cacheData);

var_export($route->match('/units/kg/'));
```

Код выведет `false`. Второй маршрут проверяет путь по выражению `[0-9]+` из кеша.

## Смотрите также

- [Route::getCompileCache](get-compile-cache.md)
- [Route::compile](compile.md)
