---
title: Получить ключ текущей секции Configuration::key
description: Метод Configuration::key возвращает ключ секции в текущей позиции внутреннего указателя массива. Он реализует интерфейс Iterator.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::key` возвращает ключ секции в текущей позиции внутреннего указателя массива. Он реализует интерфейс `Iterator`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function key(): mixed;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Возвращает ключ секции с типом `string` или `int`. Если текущего элемента нет, возвращает `null`.

## Примеры

**Пример.** Код выводит ключ первой секции. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->rewind();
    var_dump($configuration->key());
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::current](current.md)
- [Configuration::valid](valid.md)
