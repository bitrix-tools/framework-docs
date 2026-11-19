---
title: ErrorCollection — коллекция ошибок
description: Класс Bitrix\Main\ErrorCollection хранит объекты Error и ищет ошибку по коду.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.9

{% endnote %}

## Когда использовать

Класс `ErrorCollection` хранит список объектов [Error](../error/index.md). Контроллеры, сервисы модулей и класс `Bitrix\Main\Result` используют коллекцию, чтобы накопить ошибки и вернуть их вызывающему коду.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [setError](set-error.md) | Добавляет одну ошибку | |
| [add](add.md) | Добавляет несколько ошибок | |
| [getErrorByCode](get-error-by-code.md) | Возвращает первую ошибку с заданным кодом | |

## Наследование

Класс наследует `Bitrix\Main\Type\Dictionary`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct(?array $values = null)` | Добавляет переданные ошибки через [setError](set-error.md). Если элемент не объект `Error`, PHP выбрасывает `TypeError` |
| `offsetSet` | Запись `$collection[] = $error` и `$collection[$key] = $error` добавляет ошибку через [setError](set-error.md). Если значение не объект `Error`, PHP выбрасывает `TypeError` |

### Унаследованные методы

Методы `get`, `set`, `getValues`, `setValues`, `clear`, `toArray`, `isEmpty`, `count`, `jsonSerialize` и обход в `foreach` работают как в классе `Bitrix\Main\Type\Dictionary`. Метод `set` с ключом проверяет тип через `offsetSet`. Методы `set` с массивом и `setValues` заменяют содержимое без проверки типа.

## Смотрите также

- [Error](../error/index.md)
- [Контроллеры](../../../framework/controllers.md)
