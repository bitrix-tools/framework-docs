---
title: Получить ошибки Result::getErrors
description: Метод Result::getErrors возвращает массив объектов Error результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getErrors` возвращает все ошибки результата массивом.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function getErrors()
```

## Возвращаемое значение

Метод возвращает массив объектов [Error](../error/index.md) в порядке добавления. Если ошибок нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит код и текст каждой ошибки:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = new Result();
$result->addError(new Error('Unit code is required', 'UNIT_CODE_EMPTY'));
$result->addError(new Error('Sort must be a number', 'UNIT_SORT_INVALID'));

foreach ($result->getErrors() as $error)
{
    echo $error->getCode() . ': ' . $error->getMessage() . PHP_EOL;
}
```

Код выведет `UNIT_CODE_EMPTY: Unit code is required` и `UNIT_SORT_INVALID: Sort must be a number`.

## Смотрите также

- [Result::getErrorMessages](get-error-messages.md)
- [Result::getErrorCollection](get-error-collection.md)
