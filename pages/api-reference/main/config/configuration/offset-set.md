---
title: Изменить секцию через ArrayAccess Configuration::offsetSet
description: Метод Configuration::offsetSet передает имя и значение секции в add. Он реализует присваивание $configuration[$offset] = $value.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::offsetSet` передает имя и значение секции в `add`. Он реализует присваивание `$configuration[$offset] = $value`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function offsetSet($offset, $value): void;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` | Задает имя секции верхнего уровня |
| value\* | `mixed` | Задает новое значение секции |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Не возвращает значение.

## Особенности

Защищенную секцию метод оставляет без изменений. Чтобы записать изменения в файл, вызовите `saveConfiguration`. Передавайте имя секции, поскольку метод не реализует добавление элемента с автоматически выбранным числовым индексом.

## Примеры

**Пример.** Код записывает секцию `display` через `ArrayAccess` и читает ее значение. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

```php
<?php

use Bitrix\Main\Config\Configuration;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$path = tempnam(__DIR__, 'configuration-demo-');
if ($path === false)
{
    throw new RuntimeException('Cannot create configuration file');
}

try
{
    file_put_contents($path, '<?php return [];');
    $configuration = Configuration::getInstanceByPath($path);
    $configuration['display'] = ['mode' => 'compact'];
    var_dump($configuration->get('display'));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::add](add.md)
- [Configuration::saveConfiguration](save-configuration.md)
