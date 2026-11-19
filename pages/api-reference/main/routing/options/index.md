---
title: Routing\Options — настройки маршрута
description: Класс Bitrix\Main\Routing\Options хранит настройки маршрута или группы маршрутов — HTTP-методы, префикс, имя, регулярные выражения и значения по умолчанию параметров.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Routing`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Options` хранит настройки маршрута — HTTP-методы, префикс, имя, регулярные выражения и значения по умолчанию параметров. Метод [Route::getOptions](../route/get-options.md) возвращает настройки маршрута.

В файле маршрутов объект создавать не нужно. Методы конфигуратора маршрутов `RoutingConfigurator` с теми же именами — `prefix`, `name`, `where`, `default` и другие — передают значения в объект `Options` и возвращают конфигурацию `RoutingConfiguration` для цепочки вызовов. Методы `Options`, которые задают настройки, ничего не возвращают.

Методы `get*` и `has*` читают настройки, например [getFullName](get-full-name.md) и [getWhere](get-where.md).

Подробнее — в статье [Роутинг](../../../../framework/routing.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [methods](methods.md) | Задает HTTP-методы маршрута | |
| [getMethods](get-methods.md) | Возвращает HTTP-методы маршрута | |
| [prefix](prefix.md) | Задает префикс пути | |
| [hasPrefix](has-prefix.md) | Проверяет, задан ли префикс | |
| [getFullPrefix](get-full-prefix.md) | Возвращает префикс с префиксами родительских групп | |
| [name](name.md) | Задает имя маршрута или часть имени группы | |
| [hasName](has-name.md) | Проверяет, задано ли собственное имя | |
| [getFullName](get-full-name.md) | Возвращает полное имя с именами родительских групп | |
| [where](where.md) | Задает регулярное выражение параметра | |
| [hasWhere](has-where.md) | Проверяет, задано ли регулярное выражение параметра | |
| [getWhere](get-where.md) | Возвращает регулярные выражения параметров | |
| [default](default.md) | Задает значение параметра по умолчанию | |
| [hasDefault](has-default.md) | Проверяет, задано ли значение параметра по умолчанию | |
| [getDefault](get-default.md) | Возвращает значения параметров по умолчанию | |
| [middleware](middleware.md) | Добавляет промежуточный обработчик | |
| [domain](domain.md) | Задает домен | |
| [mergeWith](merge-with.md) | Добавляет настройки родительской группы | |
| [clearCurrent](clear-current.md) | Сбрасывает собственные префикс и имя | |

## Свойство optionList

Статическое свойство `Options::$optionList` содержит имена настроек `methods`, `middleware`, `prefix`, `name`, `domain`, `where` и `default`. Классы `RoutingConfigurator` и `RoutingConfiguration` передают в `Options` вызовы только с этими именами. Класс `RoutingConfigurator` принимает еще методы объявления маршрутов `get`, `post`, `group` и другие. Для остальных имен классы выбрасывают `Bitrix\Main\SystemException`.

## Смотрите также

- [Route](../route/index.md)
- [Router](../router/index.md)
- [Роутинг](../../../../framework/routing.md)
