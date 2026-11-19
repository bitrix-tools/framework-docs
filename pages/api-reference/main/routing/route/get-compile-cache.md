---
title: Получить данные маршрута для кеша Route::getCompileCache
description: Метод Route::getCompileCache строит регулярное выражение маршрута и возвращает его вместе с параметрами для сохранения в кеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getCompileCache` вызывает [compile](compile.md) и возвращает регулярное выражение и параметры маршрута. Класс `Bitrix\Main\Routing\CompileCache` сохраняет эти данные в кеш, чтобы не строить выражения на каждом запросе. Метод [compileFromCache](compile-from-cache.md) загружает данные из кеша.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getCompileCache()
```

## Возвращаемое значение

#|
|| Ключ | Описание ||
|| matchUri<br>`string` | Регулярное выражение для проверки пути, например `#^/units/(?<code>[^/]+)/$#` ||
|| parameters<br>`array` | Параметры шаблона. Ключи — имена параметров, значения — их регулярные выражения ||
|#

## Примеры

**Пример.** Код получает данные маршрута для кеша:

```php
<?php
use Bitrix\Main\Routing\Options;
use Bitrix\Main\Routing\Route;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$route = new Route('/units/{code}/', static fn() => 'unit');
$route->setOptions(new Options());

var_export($route->getCompileCache());
```

Код выведет:

```text
array (
  'matchUri' => '#^/units/(?<code>[^/]+)/$#',
  'parameters' => 
  array (
    'code' => '[^/]+',
  ),
)
```

## Смотрите также

- [Route::compileFromCache](compile-from-cache.md)
- [Route::compile](compile.md)
