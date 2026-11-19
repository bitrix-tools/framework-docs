---
title: Получить данные из кеша Cache::getVars
description: Метод Cache::getVars возвращает данные, которые прочитал initCache или передали в startDataCache.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::getVars` возвращает данные кеша. После успешного [initCache](init-cache.md) это данные, которые сохранил [endDataCache](end-data-cache.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function getVars()
```

## Возвращаемое значение

Метод возвращает данные в том виде, в котором их сохранили, например массив. Если `initCache` не нашел кеш, метод возвращает `false`.

После [startDataCache](start-data-cache.md) метод возвращает значение аргумента `vars` метода `startDataCache`.

Метод [endDataCache](end-data-cache.md) не меняет значение, которое возвращает `getVars`. Сразу после записи кеша используйте переменную с данными, которые передали в `endDataCache`.

## Примеры

**Пример.** Код сохраняет массив в кеш и читает его другим объектом:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->initCache(3600, 'units_titles', '/units');
$cache->startDataCache();
$cache->endDataCache(['kg' => 'Kilogram']);

$reader = Cache::createInstance();
$reader->initCache(3600, 'units_titles', '/units');

echo $reader->getVars()['kg'];

$cache->clean('units_titles', '/units');
```

Код выведет `Kilogram`.

## Смотрите также

- [Cache::initCache](init-cache.md)
- [Cache::endDataCache](end-data-cache.md)
