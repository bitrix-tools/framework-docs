---
title: Удалить регистрацию пространства имен Loader::unregisterNamespace
description: Метод Loader::unregisterNamespace удаляет все каталоги, которые registerNamespace связал с пространством имен.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loader::unregisterNamespace` удаляет регистрацию пространства имен. Автозагрузчик перестает искать в его каталогах новые классы. Уже загруженные классы остаются доступны.

Метод [includeModule](include-module.md) вызывает этот метод, если файл `include.php` модуля вернул `false`.

Сигнатура метода в классе `Bitrix\Main\Loader`:

```php
public static function unregisterNamespace($namespace)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| namespace\* | `string` | Задает пространство имен. Регистр и обратные косые черты в начале и в конце не важны |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает. Метод удаляет все каталоги пространства имен, а не один из них.

## Примеры

**Пример.** Код регистрирует пространство имен, удаляет регистрацию и проверяет список:

```php
<?php
use Bitrix\Main\Loader;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loader::registerNamespace('Vendor\Units', $_SERVER['DOCUMENT_ROOT'] . '/local/php_interface/units_lib');
Loader::unregisterNamespace('Vendor\Units');

var_dump(isset(Loader::getNamespaces()['vendor\\units\\']));
```

Код выведет `bool(false)`.

## Смотрите также

- [Loader::registerNamespace](register-namespace.md)
