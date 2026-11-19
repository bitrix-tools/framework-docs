---
title: Проверить, идет ли запись кеша Cache::isStarted
description: Метод Cache::isStarted проверяет, начал ли startDataCache запись кеша, которую еще не завершили.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::isStarted` проверяет, идет ли запись кеша — вызван [startDataCache](start-data-cache.md), но еще не вызван [endDataCache](end-data-cache.md) или [abortDataCache](abort-data-cache.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function isStarted()
```

## Возвращаемое значение

Метод возвращает `true`, если запись идет, иначе `false`. Если `startDataCache` нашел кеш или получил время жизни 0 или меньше, метод не начинает запись.

## Примеры

**Пример.** Код проверяет состояние до и после записи:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->startDataCache(3600, 'units_state', '/units');
$during = $cache->isStarted();
$cache->endDataCache(['kg']);

var_export([$during, $cache->isStarted()]);

$cache->clean('units_state', '/units');
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [Cache::startDataCache](start-data-cache.md)
