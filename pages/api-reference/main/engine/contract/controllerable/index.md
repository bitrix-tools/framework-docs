---
title: Controllerable — компонент или контроллер с действиями
description: Интерфейс Bitrix\Main\Engine\Contract\Controllerable описывает класс, который объявляет AJAX-действия и настраивает для них фильтры.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Engine\Contract`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Интерфейс `Controllerable` реализуют классы, которые принимают AJAX-запросы к действиям. Класс `Bitrix\Main\Engine\Controller` уже реализует интерфейс. Класс компонента из файла `class.php` реализует его сам, чтобы обрабатывать запросы в режиме `class`.

Действие — публичный метод с суффиксом `Action`, например `listAction` для действия `list`. Метод [configureActions](configure-actions.md) возвращает настройки фильтров для действий.

Если компонент не реализует интерфейс, роутер AJAX-запросов выбрасывает `Bitrix\Main\SystemException` и не выполняет действие.

Подробнее о действиях компонента — в разделе [Работа с контроллерами](../../../../../framework/components.md#component-controllers) статьи о компонентах.

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [configureActions](configure-actions.md) | Возвращает настройки фильтров для действий | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `METHOD_ACTION_SUFFIX` | `Action` | Суффикс имени метода-действия |

## Смотрите также

- [ActionFilter\Base](../../action-filter/base/index.md)
- [Контроллеры](../../../../../framework/controllers.md)
- [Компоненты](../../../../../framework/components.md)
