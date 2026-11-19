---
title: Event — событие ORM
description: Класс Bitrix\Main\ORM\Event передает обработчикам событие операции ORM-класса и собирает из результатов ошибки и изменения полей.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `DataManager` создает объект `Event` при операциях `add`, `update` и `delete` и передает его обработчикам событий ORM. Обработчик читает из объекта параметры события, например `fields` и `object`, и ORM-сущность методом [getEntity](get-entity.md).

После отправки события `DataManager` собирает ошибки обработчиков методом [getErrors](get-errors.md) и применяет изменения полей методом [mergeObjectFields](merge-object-fields.md). Обработчик передает изменения и ошибки в объекте `Bitrix\Main\ORM\EventResult`.

Старое имя класса `Bitrix\Main\Entity\Event` работает как псевдоним этого класса.

Подробнее о событиях ORM — в разделе [События](../../../../orm/entity-operations.md#events) статьи об операциях с данными.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getEntity](get-entity.md) | Возвращает ORM-сущность, для которой создали событие | 14.0.4 |
| [getErrors](get-errors.md) | Переносит ошибки обработчиков в результат операции | 14.0.4 |
| [mergeFields](merge-fields.md) | Применяет изменения полей из обработчиков к массиву данных | 14.0.4 |
| [mergeObjectFields](merge-object-fields.md) | Применяет изменения полей из обработчиков к объекту ORM | |

## Наследование

Класс наследует `Bitrix\Main\Event`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct(Entity $entity, $type, array $parameters = [], $withNamespace = false)` | Берет код модуля из сущности. Имя события строит из имени сущности и типа, например `DemoUnitOnBeforeAdd`. Если `withNamespace` равен `true`, добавляет пространство имен и разделитель `::`, например `\Partner\Catalog\DemoUnit::OnBeforeAdd`. `DataManager` отправляет каждое событие в двух вариантах имени |
| `send` | Для события с пространством имен и типом из констант `DataManager::EVENT_ON_*` сначала вызывает одноименный статический метод ORM-класса, например `onBeforeAdd`, затем отправляет событие обработчикам. Если метод ORM-класса вернул `null`, результат не добавляется. Если метод вернул значение другого класса, в том числе `Bitrix\Main\EventResult`, `send` записывает вместо него пустой `Bitrix\Main\ORM\EventResult` с типом `SUCCESS` |

### Унаследованные методы

Методы `getParameters`, `getParameter`, `setParameter`, `getResults`, `addResult`, `getModuleId`, `getEventType` и другие работают как в классе `Bitrix\Main\Event`.

## Смотрите также

- [EventResult](../../event-result/index.md)
- [Операции с данными ORM](../../../../orm/entity-operations.md)
