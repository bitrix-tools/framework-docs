---
title: Добавить несколько ошибок ErrorCollection::add
description: Метод ErrorCollection::add добавляет в коллекцию массив ошибок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ErrorCollection::add` добавляет в коллекцию массив объектов [Error](../error/index.md). Метод вызывает [setError](set-error.md) для каждого элемента и добавляет ошибки в конец. Ключи массива метод не сохраняет.

Сигнатура метода в классе `Bitrix\Main\ErrorCollection`:

```php
public function add(array $errors)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| errors\* | `Bitrix\Main\Error[]` | Задает ошибки |

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `TypeError` | Элемент массива не объект `Error`. Исключение выбрасывает PHP |

## Примеры

**Пример.** Код переносит ошибки из одной коллекции в другую:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\ErrorCollection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$validationErrors = new ErrorCollection([new Error('Unit code is required', 'UNIT_CODE_EMPTY')]);

$allErrors = new ErrorCollection();
$allErrors->add($validationErrors->toArray());

echo count($allErrors);
```

## Смотрите также

- [ErrorCollection::setError](set-error.md)
