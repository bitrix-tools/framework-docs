---
title: Получить первую ошибку Result::getError
description: Метод Result::getError возвращает первую ошибку результата или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getError` возвращает первую ошибку результата. Метод подходит, когда нужна одна ошибка для ответа пользователю.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function getError(): ?Error
```

## Возвращаемое значение

Метод возвращает объект [Error](../error/index.md) или `null`, если ошибок нет.

## Примеры

**Пример.** Код выводит текст первой ошибки из двух:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = new Result();
$result->addError(new Error('Unit code is required'));
$result->addError(new Error('Sort must be a number'));

echo $result->getError()?->getMessage();
```

Код выведет `Unit code is required`.

## Смотрите также

- [Result::getErrors](get-errors.md)
