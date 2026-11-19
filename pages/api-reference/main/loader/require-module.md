---
title: Подключить модуль или выбросить исключение Loader::requireModule
description: Метод Loader::requireModule подключает модуль методом includeModule и выбрасывает LoaderException, если модуль не подключился.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::requireModule` подключает модуль методом [includeModule](include-module.md). Если модуль не подключился, метод выбрасывает исключение. Метод нужен, если код не может работать без модуля.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function requireModule($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если модуль подключен. Если метод [setRequireThrowException](set-require-throw-exception.md) отключил исключение, для неподключенного модуля метод возвращает `false`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Модуль не подключился или код модуля пустой, не строка или содержит недопустимые символы. Если модуль не подключился, сообщение — ``Required module `<код>` was not found`` |

## Примеры

**Пример.** Код требует модуль, которого нет, и обрабатывает исключение:

```php
<?php
use Bitrix\Main\Loader;
use Bitrix\Main\LoaderException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    Loader::requireModule('vendor.units');
    echo 'ready';
}
catch (LoaderException $exception)
{
    echo $exception->getMessage();
}
```

Если модуль `vendor.units` не установлен, код выведет ``Required module `vendor.units` was not found``.

## Смотрите также

- [Loader::includeModule](include-module.md)
- [Loader::setRequireThrowException](set-require-throw-exception.md)
