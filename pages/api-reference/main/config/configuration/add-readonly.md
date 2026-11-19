---
title: Добавить защищенную секцию Configuration::addReadonly
description: Метод Configuration::addReadonly записывает значение секции в память и устанавливает флаг readonly в true. Он заменяет и уже защищенную секцию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::addReadonly` записывает значение секции в память и устанавливает флаг `readonly` в `true`. Он заменяет и уже защищенную секцию.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function addReadonly($name, $value): self;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |
| value\* | `mixed` | Задает новое значение секции |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Возвращает текущий объект `Configuration`.

## Особенности

Флаг `readonly` запрещает изменение через `add` и удаление через `delete`. Сам метод `addReadonly` эту защиту не проверяет. Чтобы записать изменения в файл, вызовите `saveConfiguration`. Если объект загрузил дополнительный файл `.settings_extra.php`, метод меняет секцию и в текущем, и в основном наборах.

## Примеры

**Пример.** Код защищает секцию `display` от изменения через `add` и выводит прежнее значение. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->addReadonly('display', ['mode' => 'compact']);
    $configuration->add('display', ['mode' => 'full']);
    var_dump($configuration->get('display'));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::add](add.md)
- [Configuration::delete](delete.md)
- [Configuration::saveConfiguration](save-configuration.md)
