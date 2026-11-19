---
title: Удалить секцию Configuration::delete
description: Метод Configuration::delete удаляет секцию из памяти, если ее флаг readonly равен false. Отсутствующую или защищенную секцию он оставляет без изменений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::delete` удаляет секцию из памяти, если ее флаг `readonly` равен `false`. Отсутствующую или защищенную секцию он оставляет без изменений.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function delete($name): self;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `http_client_options` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Возвращает текущий объект `Configuration`.

## Особенности

Чтобы записать удаление в файл, вызовите `saveConfiguration`. Если объект загрузил дополнительный файл `.settings_extra.php`, метод отдельно проверяет секцию в текущем и основном наборах. Удаление из памяти не удаляет секцию из `.settings_extra.php`, поэтому при новом чтении файла она может появиться снова.

## Примеры

**Пример.** Код удаляет секцию `display` и получает `null` при повторном чтении. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->delete('display');
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
