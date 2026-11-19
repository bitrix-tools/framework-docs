---
title: Создать ошибку из исключения Error::createFromThrowable
description: Метод Error::createFromThrowable создает ошибку с сообщением и кодом исключения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Error::createFromThrowable` создает ошибку с сообщением и кодом исключения. Так код перехватывает исключение и возвращает его как ошибку в результате.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public static function createFromThrowable(Throwable $exception): static
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| exception\* | `Throwable` | Задает исключение |

## Возвращаемое значение

Метод возвращает объект класса, у которого его вызвали, — `Error` или наследника. Дополнительные данные ошибки равны `null`.

## Примеры

**Пример.** Код перехватывает исключение разбора JSON и превращает его в ошибку:

```php
<?php
use Bitrix\Main\ArgumentException;
use Bitrix\Main\Error;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    Json::decode('{broken');
}
catch (ArgumentException $exception)
{
    $error = Error::createFromThrowable($exception);
    echo $error->getMessage();
}
```

## Смотрите также

- [Error::__construct](construct.md)
