---
title: Получить коллекцию ошибок Result::getErrorCollection
description: Метод Result::getErrorCollection возвращает коллекцию ErrorCollection с ошибками результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.9

{% endnote %}

Метод `Result::getErrorCollection` возвращает коллекцию ошибок результата. Метод коллекции [ErrorCollection::getErrorByCode](../error-collection/get-error-by-code.md) находит в ней ошибку по коду.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function getErrorCollection()
```

## Возвращаемое значение

Метод возвращает саму коллекцию ошибок результата [ErrorCollection](../error-collection/index.md), а не ее копию.

## Особенности

Ошибка, которую добавили прямо в коллекцию, не меняет [isSuccess](is-success.md). Чтобы результат стал неуспешным, добавляйте ошибки методами [addError](add-error.md) и [addErrors](add-errors.md).

## Примеры

**Пример.** Код ищет ошибку по коду:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = new Result();
$result->addError(new Error('Unit code is required', 'UNIT_CODE_EMPTY'));

$error = $result->getErrorCollection()->getErrorByCode('UNIT_CODE_EMPTY');
echo $error === null ? 'No error' : $error->getMessage();
```

Код выведет `Unit code is required`.

## Смотрите также

- [ErrorCollection](../error-collection/index.md)
- [Result::getErrors](get-errors.md)
