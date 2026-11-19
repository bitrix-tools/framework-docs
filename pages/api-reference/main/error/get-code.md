---
title: Получить код ошибки Error::getCode
description: Метод Error::getCode возвращает код ошибки, переданный в конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.9

{% endnote %}

Метод `Error::getCode` возвращает код ошибки. Код приложения различает ошибки по их кодам, не разбирая текст сообщения.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function getCode()
```

## Возвращаемое значение

Метод возвращает значение, переданное в конструктор: целое число `int` или строку `string`. По умолчанию — `0`.

## Примеры

**Пример.** Код проверяет код ошибки:

```php
<?php
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$error = new Error('Unit code is required', 'UNIT_CODE_EMPTY');

if ($error->getCode() === 'UNIT_CODE_EMPTY')
{
    echo 'Fill in the unit code';
}
```

## Смотрите также

- [ErrorCollection::getErrorByCode](../error-collection/get-error-by-code.md)
- [Error::getMessage](get-message.md)
