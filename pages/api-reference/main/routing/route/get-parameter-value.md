---
title: Получить значение параметра маршрута Route::getParameterValue
description: Метод Route::getParameterValue возвращает значение параметра маршрута из пути текущего запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Route::getParameterValue` возвращает значение параметра маршрута по имени. Метод [Router::match](../router/match.md) заполняет значения, когда находит маршрут для запроса.

Сигнатура метода в классе `Bitrix\Main\Routing\Route`:

```php
public function getParameterValue($name)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя параметра без фигурных скобок, например `code` для шаблона `/units/{code}/` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку со значением параметра или значение по умолчанию из настроек маршрута. Если параметра нет или метод `Router::match` не заполнял значения, метод возвращает `null`.

Метод [match](match.md) самого маршрута не сохраняет значения.

## Примеры

**Пример.** Код читает параметр `code` у маршрута текущего запроса:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$app = Application::getInstance();

if ($app->hasCurrentRoute())
{
    echo $app->getCurrentRoute()->getParameterValue('code');
}
else
{
    echo 'Страница открыта не через маршрут';
}
```

Для запроса `/units/kg/` к маршруту `/units/{code}/` код выведет `kg`. Для страницы без маршрута и при запуске из консоли код выведет `Страница открыта не через маршрут`.

В обработчике маршрута параметры приходят аргументами действия или замыкания. Подробнее — в статье [Роутинг](../../../../framework/routing.md#route-parameters).

## Смотрите также

- [Route::getParametersValues](get-parameters-values.md)
- [Router::match](../router/match.md)
