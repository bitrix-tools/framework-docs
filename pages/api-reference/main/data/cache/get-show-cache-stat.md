---
title: Проверить, включен ли сбор статистики Cache::getShowCacheStat
description: Метод Cache::getShowCacheStat возвращает флаг сбора статистики кеша.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Cache::getShowCacheStat` возвращает флаг сбора статистики кеша, который задал [setShowCacheStat](set-show-cache-stat.md).

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public static function getShowCacheStat()
```

## Возвращаемое значение

Метод возвращает значение, которое передали в `setShowCacheStat`. Ядро передает `bool`. По умолчанию метод возвращает `false`.

## Примеры

**Пример.** Код проверяет флаг без параметра `show_cache_stat`:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Cache::getShowCacheStat());
```

Если в запросе нет параметра и cookie `show_cache_stat`, код выведет `bool(false)`.

## Смотрите также

- [Cache::setShowCacheStat](set-show-cache-stat.md)
