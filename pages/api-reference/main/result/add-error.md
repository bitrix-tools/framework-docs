---
title: Добавить ошибку Result::addError
description: Метод Result::addError добавляет ошибку в результат и делает результат неуспешным.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::addError` добавляет ошибку в коллекцию и делает результат неуспешным. После вызова метод [isSuccess](is-success.md) возвращает `false`.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function addError(Error $error)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| error\* | `Bitrix\Main\Error` | Задает ошибку |

## Возвращаемое значение

Метод возвращает тот же объект результата, поэтому вызов можно продолжить цепочкой.

## Примеры

**Пример.** Код создает результат с ошибкой одной цепочкой вызовов и выводит код ошибки:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = (new Result())->addError(new Error('Unit not found', 'UNIT_NOT_FOUND'));

echo $result->getError()->getCode();
```

Код выведет `UNIT_NOT_FOUND`.

## Смотрите также

- [Result::addErrors](add-errors.md)
- [Error](../error/index.md)
