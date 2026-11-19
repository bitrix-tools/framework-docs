---
title: Route — маршрут
description: Класс Bitrix\Main\Routing\Route хранит шаблон URL, обработчик и настройки маршрута, проверяет путь запроса по шаблону и возвращает значения параметров.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Routing`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Объект `Route` описывает один маршрут: шаблон URL, обработчик и настройки. Конфигуратор маршрутов `RoutingConfigurator` создает объекты из файлов маршрутов, поэтому создавать их конструктором в коде приложения не нужно.

Чтобы прочитать параметры текущего маршрута, получите объект одним из способов:

- метод [Router::match](../router/match.md) возвращает маршрут, который подходит запросу, и заполняет значения его параметров,
- метод `Application::getInstance()->getCurrentRoute()` возвращает маршрут текущего запроса, метод `hasCurrentRoute` проверяет, что он есть,
- обработчик-замыкание получает маршрут, если объявит параметр с типом `Route`.

Метод [getParameterValue](get-parameter-value.md) возвращает значение параметра, метод [getParametersValues](get-parameters-values.md) — значения всех параметров.

Подробнее о маршрутах — в статье [Роутинг](../../../../framework/routing.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает маршрут из шаблона URL и обработчика | |
| [getUri](get-uri.md) | Возвращает шаблон URL с префиксом группы | |
| [getController](get-controller.md) | Возвращает обработчик маршрута | |
| [getOptions](get-options.md) | Возвращает настройки маршрута | |
| [setOptions](set-options.md) | Задает настройки маршрута | |
| [getParameterValue](get-parameter-value.md) | Возвращает значение параметра из пути запроса | |
| [getParametersValues](get-parameters-values.md) | Возвращает значения всех параметров из пути запроса | |
| [match](match.md) | Проверяет путь по шаблону и возвращает значения параметров | |
| [compile](compile.md) | Строит регулярное выражение по шаблону | |
| [getParameters](get-parameters.md) | Возвращает параметры шаблона и их регулярные выражения | |
| [getCompileCache](get-compile-cache.md) | Возвращает регулярное выражение и параметры для кеша | |
| [compileFromCache](compile-from-cache.md) | Загружает регулярное выражение и параметры из кеша | |

## Смотрите также

- [Router](../router/index.md)
- [Роутинг](../../../../framework/routing.md)
- [Контроллеры](../../../../framework/controllers.md)
