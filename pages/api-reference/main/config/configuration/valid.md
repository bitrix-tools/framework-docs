---
title: Проверить позицию итератора Configuration::valid
description: Метод Configuration::valid проверяет наличие секции по текущему ключу массива. Он реализует интерфейс Iterator.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Configuration::valid` проверяет наличие секции по текущему ключу массива. Он реализует интерфейс `Iterator`.

Сигнатура метода в классе `Bitrix\Main\Config\Configuration`:

```php
public function valid(): bool;
```

## Параметры

Метод не принимает параметров.

## Возвращаемое значение

Возвращает результат `isset($data[$key])` для текущего ключа. При обычном массиве секций возвращает `false` после конца перебора. Значение `value => null` внутри секции не делает позицию недействительной.

## Примеры

**Пример.** Код проверяет действительную позицию и позицию после конца перебора. Каталог примера должен быть доступен для записи. Блок `finally` удаляет созданный временный файл.

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
    $configuration->rewind();
    var_dump($configuration->valid());
    $configuration->next();
    var_dump($configuration->valid());
}
finally
{
    unlink($path);
}
```

## Смотрите также

- [Configuration::key](key.md)
- [Configuration::current](current.md)
- [Configuration::next](next.md)
