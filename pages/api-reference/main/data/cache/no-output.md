---
title: Отключить кеширование вывода Cache::noOutput
description: Метод Cache::noOutput отключает перехват и вывод HTML. Объект кеширует только данные.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::noOutput` отключает работу с HTML. После вызова объект кеширует только данные: [startDataCache](start-data-cache.md) не включает буфер вывода, [endDataCache](end-data-cache.md) сохраняет пустой HTML, а [output](output.md) ничего не выводит.

Метод нужен, когда код кеширует только данные, а вывод между `startDataCache` и `endDataCache` должен сразу уйти на страницу.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function noOutput()
```

## Возвращаемое значение

Метод ничего не возвращает. У того же объекта вывод нельзя включить снова. Создайте новый объект.

## Примеры

**Пример.** Код кеширует только данные, а сообщение выводит сразу:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->noOutput();

if ($cache->initCache(3600, 'units_data', '/units'))
{
    $units = $cache->getVars();
}
elseif ($cache->startDataCache())
{
    echo 'calculated ';
    $units = ['kg', 'g'];
    $cache->endDataCache($units);
}

echo count($units);

$cache->clean('units_data', '/units');
```

Код выведет `calculated 2`.

## Смотрите также

- [Cache::output](output.md)
