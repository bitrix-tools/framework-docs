---
title: Создать ошибку Error::__construct
description: Конструктор Error создает ошибку из сообщения, кода и дополнительных данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Error::__construct` создает ошибку из сообщения, кода и дополнительных данных. Конструктор только сохраняет значения и не проверяет их.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function __construct($message, $code = 0, $customData = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| message\* | `string`, `Bitrix\Main\Localization\LocalizableMessageInterface` | Задает сообщение. Переводимое сообщение метод [getMessage](get-message.md) переводит на язык в момент вызова |
| code | `int`, `string` | Задает код ошибки. По умолчанию — `0` |
| customData | `mixed` | Задает дополнительные данные, например массив с именем поля. По умолчанию — `null` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Примеры

**Пример.** Код создает ошибку с кодом и именем поля и выводит ее в JSON:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$error = new Error('Unit code is required', 'UNIT_CODE_EMPTY', ['field' => 'CODE']);

echo Json::encode($error);
```

Код выведет `{"message":"Unit code is required","code":"UNIT_CODE_EMPTY","customData":{"field":"CODE"}}`.

## Смотрите также

- [Error::createFromThrowable](create-from-throwable.md)
- [ErrorCollection::setError](../error-collection/set-error.md)
