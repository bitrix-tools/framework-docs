---
title: Json — кодирование и разбор JSON
description: Класс Bitrix\Main\Web\Json кодирует данные в JSON, разбирает JSON и проверяет строку на корректность.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Web`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.8

{% endnote %}

## Когда использовать

Класс `Json` кодирует данные в JSON и разбирает JSON в массивы PHP. В отличие от функций `json_encode` и `json_decode`, методы `encode` и `decode` выбрасывают `ArgumentException` при ошибке. Метод `encode` по умолчанию экранирует символы HTML. Все методы класса статические.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [encode](encode.md) | Кодирует данные в строку JSON | |
| [decode](decode.md) | Разбирает строку JSON в значение PHP | |
| [validate](validate.md) | Проверяет, что строка — корректный JSON | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `DEFAULT_OPTIONS` | `JSON_HEX_TAG \| JSON_HEX_AMP \| JSON_HEX_APOS \| JSON_HEX_QUOT \| JSON_UNESCAPED_UNICODE \| JSON_INVALID_UTF8_SUBSTITUTE` | Флаги [encode](encode.md) по умолчанию |

## Смотрите также

- [Контроллеры](../../../../framework/controllers.md)
