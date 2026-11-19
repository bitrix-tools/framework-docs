---
title: Добавить строку запроса к URL Router::url
description: Метод Router::url добавляет к URL строку запроса из массива параметров.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Router::url` добавляет к переданному URL строку запроса из массива параметров. Метод не ищет маршрут и не проверяет URL. Чтобы построить URL по имени маршрута, используйте [route](route.md).

Сигнатура метода в классе `Bitrix\Main\Routing\Router`:

```php
public function url($url, $parameters = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` | Задает URL |
| parameters | `array` | Задает параметры строки запроса. По умолчанию — пустой массив |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает URL со строкой запроса, которую строит функция `http_build_query`. Если `parameters` пустой, метод возвращает `url` без изменений. Метод всегда ставит перед параметрами `?`, даже если в `url` уже есть строка запроса.

## Примеры

**Пример.** Код добавляет к URL два параметра:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$router = Application::getInstance()->getRouter();

echo $router->url('/units/', ['status' => 'active', 'sort' => 'code']);
```

Код выведет `/units/?status=active&sort=code`.

## Смотрите также

- [Router::route](route.md)
