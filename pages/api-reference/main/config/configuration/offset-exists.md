---
title: Проверить наличие секции Configuration::offsetExists
description: Метод Configuration::offsetExists проверяет наличие секции. Он реализует проверку isset($configuration[$offset]) интерфейса ArrayAccess.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::offsetExists` проверяет наличие секции. Он реализует проверку `isset($configuration[$offset])` интерфейса `ArrayAccess`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function offsetExists($offset): bool;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` | Задает имя секции верхнего уровня |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Возвращает `true`, если `isset` для самой секции дает `true`, иначе `false`. Секция с массивом `value => null` считается существующей.

## Примеры

**Пример.** Код проверяет наличие секции `display` со значением `null`. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->add('display', null);
    var_dump(isset($configuration['display']));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::offsetGet](offset-get.md)
- [Configuration::get](get.md)
