---
title: Подключить модуль класса и загрузить класс Loader::requireClass
description: Метод Loader::requireClass определяет модуль по пространству имен класса, подключает его и загружает класс.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::requireClass` определяет модуль по пространству имен класса, подключает модуль и загружает класс методом [autoLoad](auto-load.md). Метод нужен, когда код получает имя класса строкой и заранее не знает, какой модуль подключить. Например, маршрутизатор вызывает метод для класса контроллера из файла маршрутов.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function requireClass($className)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| className\* | `string` | Задает полное имя класса |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Чтобы проверить, что класс загружен, вызовите `class_exists($className, false)`.

Метод определяет модуль по первым частям имени:

- `Bitrix\Iblock\...` — модуль `iblock`,
- `Vendor\Units\...` — модуль `vendor.units`.

Если в имени меньше трех частей, метод не подключает модуль и только вызывает `autoLoad`. Если в имени есть недопустимые символы, метод ничего не делает.
## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Модуль класса не подключился. Сообщение — ``There is no `<класс>` class, module `<модуль>` is unavailable`` |

## Особенности

Метод считает первые две части имени кодом модуля для любого класса. Для класса не из модуля, например `Psr\Log\LoggerInterface` или класса из своего `registerNamespace`, метод попробует подключить несуществующий модуль, например `psr.log`, и выбросит исключение. Для таких классов используйте `class_exists`.

## Примеры

**Пример.** Код подключает модуль по имени класса и проверяет, что класс загружен:

```php
<?php
use Bitrix\Main\Loader;
use Bitrix\Main\LoaderException;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    Loader::requireClass('Bitrix\Iblock\IblockTable');
    echo class_exists('Bitrix\Iblock\IblockTable', false) ? 'loaded' : 'not loaded';
}
catch (LoaderException $exception)
{
    echo $exception->getMessage();
}
```

Если модуль инфоблоков установлен, код выведет `loaded`.

## Смотрите также

- [Loader::includeModule](include-module.md)
- [Loader::autoLoad](auto-load.md)
