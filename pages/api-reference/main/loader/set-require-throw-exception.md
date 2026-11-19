---
title: Включить или отключить исключение при подключении модуля Loader::setRequireThrowException
description: Метод Loader::setRequireThrowException задает, выбрасывает ли requireModule исключение для неподключенного модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::setRequireThrowException` задает, выбрасывает ли метод [requireModule](require-module.md) исключение, если модуль не подключился. По умолчанию исключение включено.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function setRequireThrowException($requireThrowException)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| requireThrowException\* | `bool` | Задает, выбрасывать ли исключение. Метод приводит значение к `bool` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Настройка действует на весь запрос и на весь код, который вызывает `requireModule`. Если вы отключаете исключение, включите его снова в блоке `finally`. У класса нет метода, который возвращает текущее значение.

## Примеры

**Пример.** Код временно отключает исключение и проверяет модуль без блока `catch`:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loader::setRequireThrowException(false);

try
{
    var_dump(Loader::requireModule('vendor.units'));
}
finally
{
    Loader::setRequireThrowException(true);
}
```

Если модуль `vendor.units` не установлен, код выведет `bool(false)`.

## Смотрите также

- [Loader::requireModule](require-module.md)
