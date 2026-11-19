---
title: Перейти к следующей секции Configuration::next
description: Метод Configuration::next сдвигает внутренний указатель массива конфигурации к следующей секции. Он реализует интерфейс Iterator.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::next` сдвигает внутренний указатель массива конфигурации к следующей секции. Он реализует интерфейс `Iterator`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function next(): void;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Не возвращает значение.

## Примеры

**Пример.** Код переходит ко второй секции и выводит ее ключ. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->add('first', 'compact');
    $configuration->add('second', 'full');
    $configuration->rewind();
    $configuration->next();
    var_dump($configuration->key());
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::valid](valid.md)
- [Configuration::current](current.md)
- [Configuration::rewind](rewind.md)
