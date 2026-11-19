---
title: Зарегистрировать файлы классов Loader::registerAutoLoadClasses
description: Метод Loader::registerAutoLoadClasses связывает имена классов с путями к файлам, чтобы автозагрузчик подключал их без поиска.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::registerAutoLoadClasses` связывает имена классов с путями к файлам. Автозагрузчик подключает такой файл сразу, без поиска по пространствам имен. Метод нужен для классов, которые лежат не по правилам PSR-4, например классов классического API в модуле.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function registerAutoLoadClasses($moduleName, array $classes)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

#|
|| Параметр | Тип | Описание ||
|| moduleName\* | `?string` | Задает код модуля. Если код задан, пути в `classes` указывают от каталога модуля, например `lib/helper.php`. Если передан `null`, пути указывают от корня сайта и начинаются с `/`, например `/local/php_interface/helper.php` ||
|| classes\* | `array` | Задает классы. Ключ — полное имя класса, регистр не важен. Значение — путь к файлу:

```php
['Vendor\Units\Helper' => 'lib/helper.php']
```
||
|#

Тип `moduleName` в таблице описывает назначение аргумента. Сигнатура PHP объявляет только тип `classes`.

## Возвращаемое значение

Метод ничего не возвращает. Метод не проверяет, что файлы существуют.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\LoaderException` | Код модуля — пустая строка, а массив классов не пустой |

## Особенности

- Для модуля автозагрузчик берет каталог из `/local/modules/` или `/bitrix/modules/` — там, где [includeModule](include-module.md) нашел модуль. Если модуль еще не подключен, автозагрузчик берет `/bitrix/modules/`. Если задана константа `REPOSITORY_ROOT`, для модулей из `/bitrix/modules/` автозагрузчик берет каталог модуля в ней.
- Если файла нет, при обращении к классу PHP выбрасывает ошибку `Error`.

## Примеры

**Пример.** Код регистрирует класс из файла в `/upload/` и вызывает его:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$file = '/upload/units_helper_' . uniqid() . '.php';

try
{
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . $file, '<?php class UnitsHelper { public static function title() { return "Units"; } }');

    Loader::registerAutoLoadClasses(null, ['UnitsHelper' => $file]);

    echo UnitsHelper::title();
}
finally
{
    @unlink($_SERVER['DOCUMENT_ROOT'] . $file);
}
```

Код выведет `Units`. Пример создает файл класса и затем удаляет его, поэтому код работает без подготовки.

## Смотрите также

- [Loader::registerNamespace](register-namespace.md)
- [Автозагрузка классов](../../../framework/autoloading.md)
