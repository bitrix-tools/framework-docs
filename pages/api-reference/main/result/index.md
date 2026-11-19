---
title: Result — результат операции
description: Класс Bitrix\Main\Result хранит признак успеха, ошибки и данные результата операции.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Методы, которые сообщают об ошибках через результат, а не через исключение, возвращают объект `Result`. Объект хранит признак успеха, коллекцию ошибок [Error](../error/index.md) и массив данных. Код, который вызвал метод, проверяет результат методом [isSuccess](is-success.md) и читает ошибки или данные.

Классы `AddResult`, `UpdateResult` и `DeleteResult` из пространства имен `Bitrix\Main\ORM\Data` наследуют `Result` и описывают результаты операций ORM. Валидатор возвращает объект `Bitrix\Main\Validation\ValidationResult`, тоже наследника `Result`.

Подробнее — в статье [Результаты и ошибки](../../../framework/results-and-errors.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает успешный результат без ошибок и данных | |
| [isSuccess](is-success.md) | Проверяет, успешна ли операция | |
| [addError](add-error.md) | Добавляет ошибку и делает результат неуспешным | |
| [addErrors](add-errors.md) | Добавляет несколько ошибок и делает результат неуспешным, если массив не пустой | |
| [getError](get-error.md) | Возвращает первую ошибку | |
| [getErrors](get-errors.md) | Возвращает массив ошибок | |
| [getErrorMessages](get-error-messages.md) | Возвращает массив текстов ошибок | |
| [getErrorCollection](get-error-collection.md) | Возвращает коллекцию ошибок | 15.5.9 |
| [setData](set-data.md) | Сохраняет данные результата | |
| [getData](get-data.md) | Возвращает данные результата | 14.0.6 |

Если клонировать объект `Result`, PHP клонирует и коллекцию ошибок, поэтому ошибки копии не попадают в исходный результат.

## Наследники

| Класс | Собственные методы |
| --- | --- |
| `Bitrix\Main\ORM\Data\Result` | `getObject`, `setObject` |

Наследник `Bitrix\Main\ORM\Data\Result` переопределяет `isSuccess`, `getErrors` и `getErrorMessages`. Эти методы отмечают, что ошибки прочитаны. Методы `getError`, `getErrorCollection` и вызов `isSuccess(true)` отметку не ставят.

Если код не прочитал ошибки до уничтожения объекта, деструктор выдает предупреждение `E_USER_WARNING` с текстами ошибок.

## Смотрите также

- [Error](../error/index.md)
- [ErrorCollection](../error-collection/index.md)
- [Результаты и ошибки](../../../framework/results-and-errors.md)
