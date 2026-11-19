---
title: LocalizableMessageInterface — сообщение с переводом
description: Интерфейс Bitrix\Main\Localization\LocalizableMessageInterface описывает сообщение, которое возвращает текст на заданном языке в момент вывода.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Localization`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Интерфейс `LocalizableMessageInterface` описывает сообщение, которое получает перевод при выводе, а не при создании. Такое сообщение можно создать заранее, а текст получить на любом языке, например на языке получателя уведомления.

Объект с этим интерфейсом принимают:

- конструктор [Error](../../error/index.md) — в параметре `message`,
- правила валидации из `Bitrix\Main\Validation\Rule` — в параметре `errorMessage`.

Ядро реализует интерфейс в двух классах:

- `Bitrix\Main\Localization\LocalizableMessage` — фраза по коду из языкового файла,
- `Bitrix\Main\Localization\LocalizableMessagePlural` — фраза с формой множественного числа для заданного числа.

Интерфейс наследует `Stringable`. Класс-реализация должен определить метод `__toString`. Реализации ядра возвращают в нем результат [localize](localize.md) на языке из своих настроек или на текущем языке. Если фразы нет, `localize` возвращает `null`, и приведение объекта к строке завершается ошибкой `TypeError`, например в `Error::getMessage`.

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [localize](localize.md) | Возвращает текст сообщения на заданном языке | |

## Смотрите также

- [Error::getLocalizableMessage](../../error/get-localizable-message.md)
- [Валидация](../../../../framework/validation.md)
