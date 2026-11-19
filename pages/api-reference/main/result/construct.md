---
title: Создать результат Result::__construct
description: Конструктор Result создает успешный результат с пустой коллекцией ошибок и пустыми данными.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Result::__construct` создает результат операции. Новый результат успешный, коллекция ошибок и массив данных пустые.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function __construct()
```

## Примеры

**Пример.** Функция `checkUnitCode` проверяет код единицы измерения и возвращает результат. Код вызывает функцию и выводит ошибку:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

function checkUnitCode(string $code): Result
{
    $result = new Result();

    if ($code === '')
    {
        $result->addError(new Error('Unit code is required', 'UNIT_CODE_EMPTY'));
    }

    return $result;
}

$result = checkUnitCode('');

if (!$result->isSuccess())
{
    echo implode(', ', $result->getErrorMessages());
}
```

Код выведет `Unit code is required`.

## Смотрите также

- [Result::isSuccess](is-success.md)
- [Result::addError](add-error.md)
