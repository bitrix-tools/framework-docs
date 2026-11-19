---
title: Проверить строку JSON Json::validate
description: Метод Json::validate проверяет, что строка — корректный JSON, без исключений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Json::validate` проверяет, что строка — корректный JSON. Метод не выбрасывает исключение при ошибке, а возвращает `false`.

Сигнатура метода в классе `Bitrix\Main\Web\Json`:

```php
public static function validate(string $data): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `string` | Задает строку для проверки |

## Возвращаемое значение

Метод возвращает `true`, если строка — корректный JSON, иначе `false`. Строку `null` метод считает корректной.

## Примеры

**Пример.** Код проверяет две строки:

```php
<?php
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Json::validate('{"code":"kg"}'), Json::validate('{code:kg}'));
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [Json::decode](decode.md)
