---
title: Изменить и сохранить секцию Configuration::setValue
description: Метод Configuration::setValue передает значение секции в add общей конфигурации и сразу вызывает saveConfiguration.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::setValue` передает значение секции в `add` общей конфигурации и сразу вызывает `saveConfiguration`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public static function setValue($name, $value): void;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |
| value\* | `mixed` | Задает новое значение секции |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Не возвращает значение.

## Особенности

Если текущая секция защищена флагом `readonly`, вызов `add` не меняет ее, но метод все равно сохраняет конфигурацию. Метод сохраняет весь основной набор настроек, а не только указанную секцию.

## Примеры

{% note warning "" %}

Метод меняет общую конфигурацию сайта. Перед запуском сохраните резервную копию файлов настроек. Пример записывает тестовую секцию `configuration_api_demo` со значением `enabled => true`. Если такая секция уже существует, он прекращает выполнение. Блок `finally` удаляет созданную секцию и сохраняет конфигурацию.

{% endnote %}

**Пример.** Код записывает секцию общей конфигурации и выводит ее значение:

```php
<?php

use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$configuration = Configuration::getInstance();
$name = 'configuration_api_demo';
if ($configuration->offsetExists($name))
{
    throw new RuntimeException('Demo section already exists');
}

try
{
    Configuration::setValue($name, ['enabled' => true]);
    var_dump(Configuration::getValue($name));
}
finally
{
    $configuration->delete($name);
    $configuration->saveConfiguration();
}
```

## Смотрите также

- [Configuration::add](add.md)
- [Configuration::saveConfiguration](save-configuration.md)
