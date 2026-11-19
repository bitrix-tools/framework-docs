---
title: Добавить ошибку ErrorCollection::setError
description: Метод ErrorCollection::setError добавляет в коллекцию одну ошибку в конец или под заданным ключом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ErrorCollection::setError` добавляет в коллекцию один объект [Error](../error/index.md). Без ключа метод добавляет ошибку в конец, с ключом — заменяет элемент под этим ключом.

Сигнатура метода в классе `Bitrix\Main\ErrorCollection`:

```php
public function setError(Error $error, $offset = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| error\* | `Bitrix\Main\Error` | Задает ошибку |
| offset | `int`, `string`, `null` | Задает ключ элемента. По умолчанию — `null`, метод добавляет ошибку в конец |

Тип `offset` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код собирает ошибки проверки и выводит их число:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\ErrorCollection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$fields = ['CODE' => '', 'SORT' => 'abc'];
$errors = new ErrorCollection();

if ($fields['CODE'] === '')
{
    $errors->setError(new Error('Unit code is required', 'UNIT_CODE_EMPTY'));
}
if (!is_numeric($fields['SORT']))
{
    $errors->setError(new Error('Sort must be a number', 'UNIT_SORT_INVALID'));
}

echo count($errors);
```

## Смотрите также

- [ErrorCollection::add](add.md)
- [Error::__construct](../error/construct.md)
