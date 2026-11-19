---
title: Получить тексты ошибок Result::getErrorMessages
description: Метод Result::getErrorMessages возвращает массив текстов ошибок результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::getErrorMessages` возвращает тексты всех ошибок. Метод вызывает `getMessage` у каждой ошибки из [getErrors](get-errors.md).

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function getErrorMessages()
```

## Возвращаемое значение

Метод возвращает массив строк в порядке добавления ошибок. Если ошибок нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выводит тексты ошибок через запятую:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = new Result();
$result->addError(new Error('Unit code is required'));
$result->addError(new Error('Sort must be a number'));

echo implode(', ', $result->getErrorMessages());
```

Код выведет `Unit code is required, Sort must be a number`.

## Смотрите также

- [Result::getErrors](get-errors.md)
