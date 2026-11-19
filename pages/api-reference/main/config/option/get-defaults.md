---
title: Получить значения по умолчанию Option::getDefaults
description: Метод Option::getDefaults возвращает массив значений из default_option.php модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Option::getDefaults` возвращает значения параметров по умолчанию из файла `default_option.php` модуля. Он не читает сохраненные параметры из базы данных.

Сигнатура метода в классе `Bitrix\Main\Config\Option`:

```php
public static function getDefaults($moduleId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| moduleId\* | `string` | Задает идентификатор модуля. Допускает латинские буквы, цифры, точку и подчеркивание. Метод сохраняет регистр аргумента |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его тип.

## Возвращаемое значение

Метод возвращает массив из переменной `<moduleId>_default_option` файла модуля. В имени переменной точки идентификатора заменяет подчеркивание. Для `vendor.module` метод ищет `$vendor_module_default_option`.

| Элемент массива | Описание |
| --- | --- |
| Ключ | Задает имя параметра в том виде, в котором его объявил файл модуля |
| Значение | Содержит значение параметра по умолчанию. Метод сохраняет исходный тип |

Если файла нет, переменная отсутствует или содержит не массив, метод возвращает `[]`. Пустой `moduleId` не вызывает `ArgumentNullException`. Метод проверяет допустимые символы, а не обязательность непустого значения.

Метод ищет файл через `Loader::getLocal` сначала в `/local/modules/<moduleId>/default_option.php`, затем в `/bitrix/modules/<moduleId>/default_option.php`. Результат, включая пустой массив, кеширует по переданному идентификатору в пределах выполнения скрипта. Вызовы `set` и `delete` этот кеш не сбрасывают.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentOutOfRangeException` | `moduleId` содержит символы вне `a-z`, `A-Z`, `0-9`, точки и подчеркивания |

## Примеры

**Пример.** Код читает значения по умолчанию модуля `main`:

```php
<?php
use Bitrix\Main\Config\Option;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$defaults = Option::getDefaults('main');
var_dump($defaults);
```

## Смотрите также

- [Option::get](get.md).
- [Option::getForModule](get-for-module.md).
