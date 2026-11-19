---
title: Начать запись кеша Cache::startDataCache
description: Метод Cache::startDataCache выводит готовый кеш и возвращает false или включает буфер вывода и возвращает true, чтобы код подготовил данные для кеша.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::startDataCache` начинает запись кеша. Если кеш уже есть, метод выводит его HTML и возвращает `false`. Если кеша нет, метод включает буфер вывода и возвращает `true`. Тогда код готовит данные и вызывает [endDataCache](end-data-cache.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function startDataCache($TTL = false, $uniqueString = false, $initDir = false, $vars = array(), $baseDir = 'cache')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| TTL | `int` | Задает время жизни кеша в секундах |
| uniqueString | `string` | Задает ключ кеша |
| initDir | `string` или `false` | Задает каталог кеша |
| vars | `mixed` | Задает данные по умолчанию для `endDataCache` без аргумента. Если аргумент не передан, метод берет значение из объекта — подробнее в разделе «Особенности» |
| baseDir | `string` | Задает корневой каталог кеша внутри `/bitrix/`. По умолчанию — `cache` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

Метод учитывает только переданные аргументы. Если аргумент не передан, метод берет значение из последнего вызова [initCache](init-cache.md). Поэтому после `initCache` вызывайте метод без аргументов.

## Возвращаемое значение

Метод возвращает `true`, если кеша нет и нужно подготовить данные, и `false`, если метод нашел кеш и вывел его HTML.

Для `TTL`, равного 0 или меньше, метод возвращает `true`, но запись не начинает. Тогда [isStarted](is-started.md) возвращает `false`, а `endDataCache` ничего не делает.

## Особенности

Значение по умолчанию `vars` в сигнатуре метод не использует. Если `vars` не передан, метод берет данные объекта. После `initCache` это `false`, у нового объекта — `null`. Кеш с данными `null` метод `initCache` не читает. Поэтому передавайте данные в [endDataCache](end-data-cache.md), даже если кешируете только HTML, например `endDataCache([])`.

## Примеры

**Пример.** Код выводит HTML из кеша или формирует его и сохраняет:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();

if ($cache->startDataCache(3600, 'units_menu', '/units'))
{
    echo '<ul><li>kg</li><li>g</li></ul>';
    $cache->endDataCache([]);
}

$cache->clean('units_menu', '/units');
```

Код выведет `<ul><li>kg</li><li>g</li></ul>`. Если убрать последнюю строку и запустить код снова, код выведет тот же HTML из кеша.

## Смотрите также

- [Cache::endDataCache](end-data-cache.md)
- [Cache::abortDataCache](abort-data-cache.md)
- [Cache::initCache](init-cache.md)
