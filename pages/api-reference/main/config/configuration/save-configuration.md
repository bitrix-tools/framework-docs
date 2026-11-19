---
title: Сохранить конфигурацию Configuration::saveConfiguration
description: Метод Configuration::saveConfiguration записывает конфигурацию в PHP-файл с выражением return. Для объекта по пути он использует этот путь, для общей конфигурации — найденный .settings.php.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::saveConfiguration` записывает конфигурацию в PHP-файл с выражением `return`. Для объекта по пути он использует этот путь, для общей конфигурации — найденный `.settings.php`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function saveConfiguration(): void;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Не возвращает значение. Метод не возвращает результат `file_put_contents` и не проверяет его.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\Bitrix\Main\InvalidOperationException` | Объект относится к модулю с идентификатором, отличным от пустой строки и `'0'`. Класс не поддерживает перезапись конфигурационного файла модуля |

## Особенности

Если непустой `.settings_extra.php` вернул массив, метод сохраняет основной набор секций до наложения дополнительных настроек с учетом изменений через `add`, `addReadonly` и `delete`. Дополнительный файл он не перезаписывает. Если каталог отсутствует, метод создает его. Для существующего недоступного для записи файла он пытается изменить права. Для нового конфигурационного файла используйте `getInstanceByPath` с полным путем.

## Примеры

**Пример.** Код сохраняет секцию `display` во временный файл и читает записанное значение. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->saveConfiguration();
    $saved = include $path;
    var_dump($saved['display']['value']);
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::add](add.md)
- [Configuration::addReadonly](add-readonly.md)
- [Configuration::delete](delete.md)
