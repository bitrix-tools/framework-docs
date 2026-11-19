---
title: Action — действие контроллера
description: Класс Bitrix\Main\Engine\Action — базовый класс действия контроллера. Наследник реализует метод run, а контроллер создает объект действия и передает в run параметры запроса.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Engine`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Класс `Action` — базовый класс действия контроллера. Наследуйте от него класс действия, чтобы вынести логику действия из контроллера и подключать ее к разным контроллерам.

Контроллер создает действие по описанию из метода `configureActions`. Ключ `class` в описании задает класс действия. Затем контроллер вызывает [runWithSourceParametersList](run-with-source-parameters-list.md). Метод передает в `run` параметры запроса по именам аргументов, как в методе действия контроллера.

Действие-метод контроллера вида `viewAction` тоже работает через наследника `Action` — класс `InlineAction`. Создавать его не нужно.

Подробнее о действиях — в статье [Контроллеры](../../../../framework/controllers.md).

## Что реализовать в наследнике

Наследник обязан объявить публичный метод `run`. Контроллер заполняет аргументы `run` из параметров запроса и автоматически подставляемых объектов. Значение, которое вернул `run`, становится результатом действия.

Наследник может переопределить защищенные методы:

- `init()` — конструктор вызывает метод в конце работы.
- `onBeforeRun()` — действие вызывает метод перед `run`. Если метод вернул ложное значение, действие не выполняет `run` и возвращает `null`.
- `onAfterRun()` — действие вызывает метод после `run`.

Защищенные методы `addError(Error $error)` и `addErrors(array $errors)` добавляют ошибки действия. После выполнения действия контроллер переносит их в свой список.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает действие для контроллера | |
| [configure](configure.md) | Принимает дополнительные настройки действия | |
| [getName](get-name.md) | Возвращает имя действия | |
| [getController](get-controller.md) | Возвращает контроллер действия | |
| [getConfig](get-config.md) | Возвращает описание действия из контроллера | |
| [getArguments](get-arguments.md) | Возвращает аргументы метода `run` | |
| [setArguments](set-arguments.md) | Заменяет аргументы метода `run` | |
| [getBinder](get-binder.md) | Возвращает объект, который подбирает аргументы | |
| [runWithSourceParametersList](run-with-source-parameters-list.md) | Выполняет действие | |
| [getCurrentUser](get-current-user.md) | Возвращает текущего пользователя контроллера | |
| [convertKeysToCamelCase](convert-keys-to-camel-case.md) | Переводит ключи массива в camelCase | |
| [className](class-name.md) | Возвращает полное имя класса | |
| [getErrors](get-errors.md) | Возвращает ошибки действия | |
| [getErrorByCode](get-error-by-code.md) | Возвращает ошибку по коду | |

## Наследование

Класс реализует интерфейс `Bitrix\Main\Errorable`.

### Реализации

Контроллер сам создает объекты следующих наследников.

| Класс | Назначение |
| --- | --- |
| `Bitrix\Main\Engine\InlineAction` | Действие-метод контроллера, например `viewAction` |
| `Bitrix\Main\Engine\ClosureAction` | Действие из ключа `callable` в `configureActions` |
| `Bitrix\Main\Engine\FallbackAction` | Действие для неизвестного имени у контроллера с интерфейсом `FallbackActionInterface`. Имя такого действия всегда `fallback` |
| `Bitrix\Main\Engine\Component\InlineAction` | Действие-метод компонента с интерфейсом [Controllerable](../contract/controllerable/index.md) |

## Смотрите также

- [Контроллеры](../../../../framework/controllers.md)
- [CurrentUser](../current-user/index.md)
- [ActionFilter\Base](../action-filter/base/index.md)
