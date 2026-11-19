---
title: Найти ошибку по коду ErrorCollection::getErrorByCode
description: Метод ErrorCollection::getErrorByCode возвращает первую ошибку коллекции с заданным кодом или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ErrorCollection::getErrorByCode` возвращает первую ошибку коллекции с заданным кодом.

Сигнатура метода в классе `Bitrix\Main\ErrorCollection`:

```php
public function getErrorByCode($code)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `int`, `string` | Задает код ошибки. Метод сравнивает коды строго, поэтому `'10'` и `10` — разные коды |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [Error](../error/index.md) или `null`, если ошибки с таким кодом нет.

## Примеры

**Пример.** Код проверяет, есть ли в коллекции ошибка пустого кода единицы измерения:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\ErrorCollection;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$errors = new ErrorCollection([
    new Error('Unit code is required', 'UNIT_CODE_EMPTY'),
    new Error('Sort must be a number', 'UNIT_SORT_INVALID'),
]);

$error = $errors->getErrorByCode('UNIT_CODE_EMPTY');
echo $error === null ? 'No error' : $error->getMessage();
```

## Смотрите также

- [Error::getCode](../error/get-code.md)
