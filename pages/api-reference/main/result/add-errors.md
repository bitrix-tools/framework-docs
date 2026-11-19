---
title: Добавить несколько ошибок Result::addErrors
description: Метод Result::addErrors добавляет массив ошибок в результат и делает результат неуспешным, если массив не пустой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::addErrors` добавляет несколько ошибок. Метод подходит, чтобы перенести ошибки из другого результата, например `$result->addErrors($ormResult->getErrors())`.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function addErrors(array $errors)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| errors\* | `array` | Задает массив объектов [Error](../error/index.md) |

## Возвращаемое значение

Метод возвращает тот же объект результата. Если массив не пустой, результат становится неуспешным. Пустой массив метод пропускает, и результат не меняется.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `TypeError` | Элемент массива не объект `Error`. Исключение выбрасывает PHP при вызове `ErrorCollection::setError`. К этому моменту результат уже неуспешный, а ошибки до неверного элемента уже добавлены |

## Примеры

**Пример.** Код переносит ошибки проверки в общий результат операции:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$checkResult = new Result();
$checkResult->addError(new Error('Unit code is required'));
$checkResult->addError(new Error('Sort must be a number'));

$result = new Result();
$result->addErrors($checkResult->getErrors());

echo count($result->getErrors());
```

Код выведет `2`.

## Смотрите также

- [Result::addError](add-error.md)
- [ErrorCollection::add](../error-collection/add.md)
