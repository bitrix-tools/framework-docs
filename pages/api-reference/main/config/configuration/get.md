---
title: Получить значение секции объекта Configuration::get
description: Метод Configuration::get возвращает поле value указанной секции. При первом обращении объект загружает конфигурацию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::get` возвращает поле `value` указанной секции. При первом обращении объект загружает конфигурацию.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function get($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Возвращает значение секции с типом `mixed`. Если секции нет или ее поле `value` равно `null`, возвращает `null`.

## Особенности

Метод возвращает значения `false`, `0` и пустую строку без замены на `null`. Метод не возвращает флаг `readonly`.

## Примеры

**Пример.** Код читает значение секции `display` через `get`. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    var_dump($configuration->get('display'));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::getValue](get-value.md)
- [Configuration::offsetExists](offset-exists.md)
