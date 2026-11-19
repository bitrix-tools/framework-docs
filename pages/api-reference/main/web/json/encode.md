---
title: Закодировать данные в JSON Json::encode
description: Метод Json::encode кодирует данные в строку JSON и выбрасывает ArgumentException при ошибке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Json::encode` кодирует данные в строку JSON функцией `json_encode`. При ошибке метод выбрасывает исключение, а не возвращает `false`.

Сигнатура метода в классе `Bitrix\Main\Web\Json`:

```php
public static function encode($data, $options = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `mixed` | Задает данные |
| options | `int`, `null` | Задает флаги `json_encode`. По умолчанию — `null`, метод использует `Json::DEFAULT_OPTIONS`. К любым флагам метод добавляет `JSON_THROW_ON_ERROR` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` с JSON. Если в `options` есть `JSON_PARTIAL_OUTPUT_ON_ERROR`, метод заменяет значение, которое не удалось закодировать. Например, строку с некорректным UTF-8 метод записывает как `null`, а `INF` — как `0`.

С флагами по умолчанию метод заменяет символы `<`, `>`, `&`, `'` и `"` внутри строк на коды `<` и подобные, не экранирует символы Юникода и заменяет некорректные байты UTF-8 символом замены. Такой JSON можно вставить в HTML-код страницы.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Функция `json_encode` вернула ошибку. Сообщение начинается с `JSON error:`. Если в `options` есть `JSON_PARTIAL_OUTPUT_ON_ERROR`, функция не сообщает об ошибке и исключения нет |

## Примеры

**Пример.** Код кодирует массив с HTML и кириллицей:

```php
<?php
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Json::encode(['title' => '<b>Килограмм</b>', 'code' => 'kg']);
```

Код выведет `{"title":"<b>Килограмм<\/b>","code":"kg"}`.

## Смотрите также

- [Json::decode](decode.md)
