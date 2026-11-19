---
title: Загрузить класс по имени Loader::autoLoad
description: Метод Loader::autoLoad — автозагрузчик ядра. Он подключает файл класса по прямому пути, по пространству имен PSR-4 или создает псевдоним.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::autoLoad` — автозагрузчик классов ядра. Ядро регистрирует его через `spl_autoload_register` в файле `/bitrix/modules/main/include/autoload.php`. PHP вызывает метод сам при первом обращении к классу, вызывать его в коде не нужно.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function autoLoad($className)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| className\* | `string` | Задает полное имя класса |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Если метод не находит класс по пространствам имен, он ничего не делает, и PHP переходит к следующему автозагрузчику.

## Особенности

Метод ищет класс по порядку:

1. Псевдоним из [registerClassAliases](register-class-aliases.md). Метод создает псевдоним и завершает работу.
2. Прямой путь из [registerAutoLoadClasses](register-auto-load-classes.md). Метод подключает файл без проверки. Если файла нет, PHP выбрасывает ошибку `Error`.
3. Пространство имен из [registerNamespace](register-namespace.md). Метод начинает с самого длинного пространства имен класса и укорачивает его, пока не найдет файл. В каталоге метод ищет файл с исходным регистром пути, затем в нижнем регистре.

После загрузки класса метод создает его зарегистрированные псевдонимы.

Для класса с суффиксом `Table`, например `Vendor\Units\UnitTable`, метод ищет и файл без суффикса — `Unit.php` или `unit.php`.

Метод не ищет по пространствам имен класс, в имени которого есть символы, кроме латинских букв, цифр, `_` и косых черт.

## Примеры

**Пример.** Код загружает класс ядра, который еще не загружен, без обращения к нему:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$before = class_exists('Bitrix\Main\Text\Emoji', false);
Loader::autoLoad('Bitrix\Main\Text\Emoji');

var_export([$before, class_exists('Bitrix\Main\Text\Emoji', false)]);
```

Если пролог не загрузил класс `Emoji`, код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [Loader::registerNamespace](register-namespace.md)
- [Loader::requireClass](require-class.md)
- [Автозагрузка классов](../../../framework/autoloading.md)
