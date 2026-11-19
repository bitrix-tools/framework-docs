---
title: Получить значение секции Configuration::getValue
description: Метод Configuration::getValue возвращает значение секции общей конфигурации. Он вызывает get у объекта, который возвращает getInstance() без идентификатора модуля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::getValue` возвращает значение секции общей конфигурации. Он вызывает `get` у объекта, который возвращает `getInstance()` без идентификатора модуля.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public static function getValue($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Возвращает значение секции с типом `mixed`. Если секции нет или ее поле `value` равно `null`, возвращает `null`.

## Примеры

**Пример.** Получить настройки секции `http_client_options`, которая хранит параметры HTTP-клиента.

```php
<?php

use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Configuration::getValue('http_client_options'));
```

## Смотрите также

- [Configuration::get](get.md)
- [Configuration::getInstance](get-instance.md)
