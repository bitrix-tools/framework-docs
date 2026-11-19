---
title: Получить текущее значение итератора Configuration::current
description: Метод Configuration::current возвращает поле value секции в текущей позиции внутреннего указателя массива. Он реализует интерфейс Iterator.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::current` возвращает поле `value` секции в текущей позиции внутреннего указателя массива. Он реализует интерфейс `Iterator`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function current(): mixed;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Возвращает значение текущей секции. Если текущего элемента нет, возвращает `false`. Значение существующей секции также может быть `false`, поэтому наличие элемента проверяют через `valid`.

## Примеры

**Пример.** Код получает значение секции в текущей позиции итератора. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    var_dump($configuration->current());
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::key](key.md)
- [Configuration::valid](valid.md)
- [Configuration::next](next.md)
