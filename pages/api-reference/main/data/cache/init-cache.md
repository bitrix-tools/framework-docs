---
title: Проверить и прочитать кеш Cache::initCache
description: Метод Cache::initCache проверяет, есть ли действующий кеш по ключу и каталогу, и читает данные и HTML из него.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::initCache` проверяет, есть ли действующий кеш по ключу, и читает его. Метод также запоминает параметры кеша, которые потом используют [startDataCache](start-data-cache.md) и [endDataCache](end-data-cache.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function initCache($ttl, $uniqueString, $initDir = false, $baseDir = 'cache')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ttl\* | `int` | Задает время жизни кеша в секундах |
| uniqueString\* | `string` | Задает ключ кеша. Добавьте в ключ все параметры, от которых зависят данные, например идентификатор сайта и фильтр |
| initDir | `string` или `false` | Задает каталог кеша, например `/units`. Метод [cleanDir](clean-dir.md) удаляет кеш каталога целиком. По умолчанию — `false`, тогда метод использует каталог `default` |
| baseDir | `string` | Задает корневой каталог кеша внутри `/bitrix/`. По умолчанию — `cache` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если кеш найден и не истек. Тогда [getVars](get-vars.md) возвращает данные, а [output](output.md) выводит HTML.

Метод возвращает `false` без чтения кеша в трех случаях.

- `ttl` равен 0 или меньше.
- Включен режим [forceRewriting](force-rewriting.md).
- [shouldClearCache](should-clear-cache.md) вернул `true`, например администратор открыл страницу с параметром `clear_cache=Y`.

Метод также возвращает `false`, если в кеше сохранены данные `null`.

## Особенности

Файловый механизм хранит кеш в файле `/bitrix/<baseDir>/<initDir>/<путь из getPath>`. Метод берет каталог `/bitrix/` из `Application::getPersonalRoot`.

## Примеры

**Пример.** Код проверяет кеш, создает его при отсутствии и проверяет снова:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$first = $cache->initCache(3600, 'units_count', '/units');

if (!$first && $cache->startDataCache())
{
    $cache->endDataCache(['count' => 3]);
}

$second = Cache::createInstance()->initCache(3600, 'units_count', '/units');

var_export([$first, $second]);

$cache->clean('units_count', '/units');
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [Cache::startDataCache](start-data-cache.md)
- [Cache::getVars](get-vars.md)
