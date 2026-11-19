---
title: Получить значение через ArrayAccess Configuration::offsetGet
description: Метод Configuration::offsetGet передает имя секции в get. Он реализует чтение $configuration[$offset].
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::offsetGet` передает имя секции в `get`. Он реализует чтение `$configuration[$offset]`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function offsetGet($offset): mixed;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` | Задает имя секции верхнего уровня |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Возвращает поле `value` секции. Если секции нет или значение равно `null`, возвращает `null`.

## Примеры

**Пример.** Код читает значение секции `display` через `ArrayAccess`. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->add('display', ['mode' => 'compact']);
    var_dump($configuration['display']);
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::get](get.md)
- [Configuration::offsetExists](offset-exists.md)
