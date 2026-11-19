---
title: Вернуть итератор к началу Configuration::rewind
description: Метод Configuration::rewind возвращает внутренний указатель массива конфигурации к первому элементу. Он реализует интерфейс Iterator.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::rewind` возвращает внутренний указатель массива конфигурации к первому элементу. Он реализует интерфейс `Iterator`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function rewind(): void;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Не возвращает значение.

## Примеры

**Пример.** Код возвращает указатель к первой секции и выводит ее ключ. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->next();
    $configuration->rewind();
    var_dump($configuration->key());
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::next](next.md)
- [Configuration::valid](valid.md)
- [Configuration::current](current.md)
