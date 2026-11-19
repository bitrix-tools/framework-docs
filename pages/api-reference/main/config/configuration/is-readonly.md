---
title: Проверить защиту секции Configuration::isReadonly
description: Метод Configuration::isReadonly проверяет, установлен ли у секции конфигурации флаг readonly.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::isReadonly` проверяет, защищена ли секция конфигурации флагом `readonly`. Защищенную секцию методы [add](add.md) и [delete](delete.md) не меняют.

Метод появился в версии `main` новее 26.150.0.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function isReadonly(string $name): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя секции верхнего уровня, например `exception_handling` |

## Возвращаемое значение

Метод возвращает `true`, если у секции непустой флаг `readonly`. Для секции без флага и для секции, которой нет в конфигурации, метод возвращает `false`.

## Особенности

- При первом обращении метод загружает конфигурацию из файла, как и [get](get.md).
- Метод читает флаг из текущего набора секций объекта. Секции из файла `.settings_extra.php` заменяют секции основного файла целиком, поэтому флаг берется из `.settings_extra.php`, если секция есть в нем.
- Метод учитывает изменения в памяти. После [addReadonly](add-readonly.md) он возвращает `true` еще до вызова [saveConfiguration](save-configuration.md).

## Примеры

**Пример.** Код создает временный файл конфигурации с защищенной секцией `display` и незащищенной секцией `units`, затем проверяет обе секции. Каталог примера должен быть доступен для записи. Блок `finally` удаляет временный файл.

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
    file_put_contents(
        $path,
        '<?php return ['
            . '"display" => ["value" => ["mode" => "compact"], "readonly" => true],'
            . '"units" => ["value" => ["kg", "m"], "readonly" => false],'
        . '];'
    );

    $configuration = Configuration::getInstanceByPath($path);

    var_dump($configuration->isReadonly('display'));
    var_dump($configuration->isReadonly('units'));
    var_dump($configuration->isReadonly('missing'));
}
finally
{
    unlink($path);
}
```

Код выведет `bool(true)`, затем дважды `bool(false)`.

## Смотрите также

- [Configuration::addReadonly](add-readonly.md)
- [Configuration::add](add.md)
- [Configuration::delete](delete.md)
