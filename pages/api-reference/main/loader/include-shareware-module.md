---
title: Подключить модуль с демо-режимом Loader::includeSharewareModule
description: Метод Loader::includeSharewareModule подключает модуль и возвращает его состояние — установлен, в демо-режиме, демо-период закончился или не найден.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.2

{% endnote %}

Метод `Loader::includeSharewareModule` подключает модуль методом [includeModule](include-module.md) и возвращает его состояние. Метод нужен для модулей Маркетплейса с пробным периодом. Аналог в классическом API — `CModule::IncludeModuleEx`.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function includeSharewareModule($moduleName)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleName\* | `string` | Задает код модуля, например `vendor.units` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает одну из констант класса.

| Константа | Когда |
| --- | --- |
| `Loader::MODULE_INSTALLED` | Модуль подключен, демо-режима нет |
| `Loader::MODULE_DEMO` | Модуль подключен, и константа `<код модуля>_DEMO` равна `Y` |
| `Loader::MODULE_DEMO_EXPIRED` | Модуль не подключился, а константа `<код модуля>_DEMO` равна `Y` |
| `Loader::MODULE_NOT_FOUND` | Модуль не подключился, демо-режима нет |

В имени константы демо-режима вместо точек в коде модуля стоит `_`, например `vendor_units_DEMO`. Модуль задает константу в своем `include.php`. Если демо-период закончился, файл `include.php` модуля возвращает `false`.

Метод запоминает результат для модуля до конца запроса.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Код модуля пустой, не строка или содержит недопустимые символы |

## Примеры

**Пример.** Код подключает модуль и выбирает действие по его состоянию:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$state = Loader::includeSharewareModule('vendor.units');

echo match ($state)
{
    Loader::MODULE_INSTALLED, Loader::MODULE_DEMO => 'ready',
    Loader::MODULE_DEMO_EXPIRED => 'trial expired',
    default => 'not found',
};
```

Если модуль `vendor.units` не установлен, код выведет `not found`.

## Смотрите также

- [Loader::includeModule](include-module.md)
