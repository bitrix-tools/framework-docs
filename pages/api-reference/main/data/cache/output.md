---
title: Вывести HTML из кеша Cache::output
description: Метод Cache::output выводит HTML, который сохранил кеш, если вывод не отключен методом noOutput.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::output` выводит HTML, который [endDataCache](end-data-cache.md) сохранил из буфера вывода. Метод [startDataCache](start-data-cache.md) вызывает `output` сам, когда находит кеш.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function output()
```

## Возвращаемое значение

Метод ничего не возвращает. Если вывод отключен методом [noOutput](no-output.md), метод ничего не выводит.

## Примеры

**Пример.** Код кеширует HTML-фрагмент и выводит его из кеша другим объектом:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->initCache(3600, 'units_html', '/units');
ob_start();
$cache->startDataCache();
echo '<b>kg</b>';
$cache->endDataCache();
ob_end_clean();

$reader = Cache::createInstance();
if ($reader->initCache(3600, 'units_html', '/units'))
{
    $reader->output();
}

$cache->clean('units_html', '/units');
```

Код выведет `<b>kg</b>`. Внешний буфер в примере скрывает первый вывод, чтобы показать только вывод из кеша.

## Смотрите также

- [Cache::noOutput](no-output.md)
- [Cache::startDataCache](start-data-cache.md)
