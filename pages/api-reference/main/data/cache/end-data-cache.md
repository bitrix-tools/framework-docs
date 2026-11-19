---
title: Сохранить данные в кеш Cache::endDataCache
description: Метод Cache::endDataCache сохраняет в кеш данные и HTML из буфера вывода и выводит этот HTML.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::endDataCache` завершает запись кеша, которую начал [startDataCache](start-data-cache.md). Метод сохраняет в кеш данные и HTML из буфера вывода и выводит этот HTML на страницу.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function endDataCache($vars = false)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| vars | `mixed` | Задает данные для кеша, например массив. По умолчанию — `false`, тогда метод сохраняет значение `vars` из `startDataCache` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Если `startDataCache` не начал запись, метод ничего не делает.

## Особенности

- Чтобы сохранить значение `false`, оберните его в массив. Метод понимает `false` в аргументе как «взять значение из `startDataCache`».
- Кеш с данными `null` метод [initCache](init-cache.md) не читает. Вызов без аргумента сохраняет `null`, если `startDataCache` получил ключ в аргументах и до него не вызывали `initCache`. Передавайте данные, например `endDataCache([])`.
- Метод записывает данные только в хранилище. Метод [getVars](get-vars.md) того же объекта их не вернет, поэтому после записи используйте свою переменную.

## Примеры

**Пример.** Код сохраняет в кеш HTML и данные одновременно:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();

if ($cache->initCache(3600, 'units_block', '/units'))
{
    $data = $cache->getVars();
    $cache->output();
}
elseif ($cache->startDataCache())
{
    $data = ['count' => 3];
    echo '<p>3 units</p>';
    $cache->endDataCache($data);
}

echo ' ' . $data['count'];

$cache->clean('units_block', '/units');
```

Код выведет `<p>3 units</p> 3`.

## Смотрите также

- [Cache::startDataCache](start-data-cache.md)
- [Cache::getVars](get-vars.md)
