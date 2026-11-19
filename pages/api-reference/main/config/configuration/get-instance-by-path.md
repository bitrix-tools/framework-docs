---
title: Получить конфигурацию по пути Configuration::getInstanceByPath
description: Метод Configuration::getInstanceByPath возвращает объект конфигурации для указанного файла. Повторный вызов с той же строкой пути возвращает тот же объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::getInstanceByPath` возвращает объект конфигурации для указанного файла. Повторный вызов с той же строкой пути возвращает тот же объект.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public static function getInstanceByPath(string $path): self;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| path\* | `string` | Задает полный путь к конфигурационному PHP-файлу |

## Возвращаемое значение

Возвращает объект `Configuration`. Метод не загружает файл при создании объекта.

## Особенности

Файл должен возвращать массив секций. Если файл не существует или возвращает не массив, набор секций остается пустым. Объект с непустым путем не загружает дополнительный файл `.settings_extra.php`. Метод не приводит разные записи одного пути к общему ключу кеша. Путь должен указывать на доверенный PHP-файл, поскольку класс выполняет его через `include`.

## Примеры

**Пример.** Код получает один и тот же объект при повторном обращении по пути. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    var_dump($configuration === Configuration::getInstanceByPath($path));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::getInstance](get-instance.md)
- [Configuration::saveConfiguration](save-configuration.md)
