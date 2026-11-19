---
title: Посчитать секции Configuration::count
description: Метод Configuration::count возвращает количество секций в текущем массиве конфигурации. Он реализует вызов count($configuration) интерфейса Countable.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::count` возвращает количество секций в текущем массиве конфигурации. Он реализует вызов `count($configuration)` интерфейса `Countable`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function count(): int;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Возвращает число секций с типом `int`. Для пустого набора возвращает `0`.

## Особенности

Метод учитывает защищенные секции и секции с полем `value`, равным `null`. Метод считает секции верхнего уровня, а не вложенные параметры.

## Примеры

**Пример.** Код подсчитывает две секции, включая защищенную секцию и секцию со значением `null`. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->addReadonly('limits', ['max_items' => 20]);
    var_dump(count($configuration));
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::get](get.md)
- [Configuration::offsetExists](offset-exists.md)
