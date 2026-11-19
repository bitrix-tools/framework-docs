---
title: Проверить успех операции Result::isSuccess
description: Метод Result::isSuccess возвращает false, если в результат добавляли ошибки методами addError или addErrors.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::isSuccess` проверяет, успешна ли операция.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function isSuccess()
```

## Возвращаемое значение

Метод возвращает `false`, если код хотя бы раз вызвал [addError](add-error.md) или [addErrors](add-errors.md) с непустым массивом. Иначе метод возвращает `true`.

## Особенности

Метод возвращает флаг, а не проверяет коллекцию ошибок. Ошибка, которую добавили напрямую в коллекцию из [getErrorCollection](get-error-collection.md), флаг не меняет, и метод вернет `true`. Добавляйте ошибки методами `addError` и `addErrors`.

## Примеры

**Пример.** Код добавляет ошибку двумя способами и выводит результат проверки:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$direct = new Result();
$direct->getErrorCollection()->setError(new Error('Unit code is required'));

$viaMethod = new Result();
$viaMethod->addError(new Error('Unit code is required'));

var_dump($direct->isSuccess(), $viaMethod->isSuccess());
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [Result::addError](add-error.md)
- [Result::getErrors](get-errors.md)
