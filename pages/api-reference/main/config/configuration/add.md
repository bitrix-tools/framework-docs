---
title: Добавить или изменить секцию Configuration::add
description: Метод Configuration::add добавляет секцию или заменяет ее значение в памяти. У секции с флагом readonly он сохраняет прежнее значение.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::add` добавляет секцию или заменяет ее значение в памяти. У секции с флагом `readonly` он сохраняет прежнее значение.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function add($name, $value): self;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |
| value\* | `mixed` | Задает новое значение секции |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Возвращает текущий объект `Configuration`, в том числе если защищенная секция осталась без изменений.

## Особенности

Метод записывает секцию в формате `value` и `readonly`, причем `readonly` равен `false`. Он заменяет всю секцию, а не объединяет вложенные значения. Чтобы записать изменения в файл, вызовите `saveConfiguration`. Если объект загрузил дополнительный файл `.settings_extra.php`, метод отдельно проверяет защиту секции в текущем и основном наборах. Поэтому изменение сохраненного значения может отличаться от значения, которое вернет `get`.

## Примеры

**Пример.** Код добавляет секцию `display` и выводит ее значение. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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

- [Configuration::addReadonly](add-readonly.md)
- [Configuration::saveConfiguration](save-configuration.md)
