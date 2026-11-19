---
title: Удалить секцию через ArrayAccess Configuration::offsetUnset
description: Метод Configuration::offsetUnset передает имя секции в delete. Он реализует unset($configuration[$offset]).
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::offsetUnset` передает имя секции в `delete`. Он реализует `unset($configuration[$offset])`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function offsetUnset($offset): void;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` | Задает имя секции верхнего уровня |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Не возвращает значение.

## Особенности

Защищенную секцию метод оставляет без изменений. Для записи в файл нужен вызов `saveConfiguration`.

## Примеры

**Пример.** Код удаляет секцию `display` через `ArrayAccess` и проверяет ее отсутствие. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    unset($configuration['display']);
    var_dump(isset($configuration['display']));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::delete](delete.md)
- [Configuration::saveConfiguration](save-configuration.md)
