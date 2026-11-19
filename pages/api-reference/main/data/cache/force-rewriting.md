---
title: Включить перезапись кеша Cache::forceRewriting
description: Метод Cache::forceRewriting включает режим, в котором объект не читает кеш и записывает его заново.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.2

{% endnote %}

Метод `Cache::forceRewriting` включает или выключает перезапись кеша у объекта. В этом режиме [initCache](init-cache.md) не читает кеш и возвращает `false`, поэтому код готовит данные заново и сохраняет их поверх старых.

Метод нужен, чтобы обновить кеш заранее, например в агенте, до того как время жизни истечет.

Сигнатура метода в классе `Bitrix\Main\Data\Cache`:

```php
public function forceRewriting($mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode\* | `bool` | Задает режим. Метод приводит значение к `bool` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает. Режим действует только для этого объекта.

## Примеры

**Пример.** Код сохраняет кеш, а затем перезаписывает его новыми данными:

```php
<?php
use Bitrix\Main\Data\Cache;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$cache = Cache::createInstance();
$cache->startDataCache(3600, 'units_version', '/units');
$cache->endDataCache(['version' => 1]);

$refresh = Cache::createInstance();
$refresh->forceRewriting(true);
if ($refresh->startDataCache(3600, 'units_version', '/units'))
{
    $refresh->endDataCache(['version' => 2]);
}

$reader = Cache::createInstance();
$reader->initCache(3600, 'units_version', '/units');

echo $reader->getVars()['version'];

$reader->clean('units_version', '/units');
```

Код выведет `2`.

## Смотрите также

- [Cache::initCache](init-cache.md)
