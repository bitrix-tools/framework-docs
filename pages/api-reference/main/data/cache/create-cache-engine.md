---
title: Создать механизм хранения кеша Cache::createCacheEngine
description: Метод Cache::createCacheEngine создает механизм хранения кеша по секции cache файла .settings.php — файлы, Redis, Memcache или APCu.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::createCacheEngine` создает механизм хранения кеша по ключу `type` секции `cache` файла `.settings.php`. Метод [createInstance](create-instance.md) вызывает этот метод сам.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function createCacheEngine($params = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| params | `array` | Задает параметры, которые метод передает в конструктор механизма. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Data\CacheEngineInterface`. Класс механизма зависит от значения `type`.

| Значение `type` | Класс механизма |
| --- | --- |
| `files` или не задано | `CacheEngineFiles` |
| `redis` | `CacheEngineRedis` |
| `memcached` | `CacheEngineMemcached` |
| `memcache` | `CacheEngineMemcache` |
| `apc` или `apcu` | `CacheEngineApc` |
| Массив с ключом `class_name` | Свой класс из `class_name` |
| Другая строка | `CacheEngineNone`, механизм не хранит кеш |

## Особенности

- Метод запоминает механизм для набора параметров и при повторном вызове возвращает его копию.
- Если механизм не найден или недоступен, например нет расширения PHP или сервера Redis, метод возвращает `CacheEngineNone` и выдает предупреждение `E_USER_WARNING`.
- Для своего класса в массиве `type` можно задать ключи `extension` — расширение PHP, без которого метод не создает класс, и `required_file` — файл класса в `/local/` или `/bitrix/`.

## Примеры

**Пример.** Код выводит класс механизма хранения:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo get_class(Cache::createCacheEngine());
```

При файловом кеше код выведет `Bitrix\Main\Data\CacheEngineFiles`.

## Смотрите также

- [Cache::getCacheEngineType](get-cache-engine-type.md)
- [Кеширование](../../../../performance/caching.md)
