---
title: Получить тегированный кеш Application::getTaggedCache
description: Метод Application::getTaggedCache возвращает тегированный кеш — он привязывает каталоги кеша к тегам и сбрасывает их по тегу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `Application::getTaggedCache` возвращает тегированный кеш. Тег связывает каталог кеша с данными, например `iblock_id_5`. Код, который меняет данные, сбрасывает тег, и ядро удаляет все каталоги кеша с этим тегом.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getTaggedCache()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Data\TaggedCache`. Объект один на запрос.

## Особенности

Компоненты ядра регистрируют теги, только если определена константа `BX_COMP_MANAGED_CACHE`. Пролог определяет ее, когда в настройках главного модуля включен тегированный кеш. Методы `TaggedCache` константу не проверяют.

## Примеры

**Пример.** Код кеширует данные с тегом и сбрасывает кеш по тегу:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$cache = $application->getCache();
$taggedCache = $application->getTaggedCache();
$dir = '/vendor/units';

if ($cache->startDataCache(3600, 'units', $dir))
{
    $taggedCache->startTagCache($dir);
    $taggedCache->registerTag('vendor_units');
    $taggedCache->endTagCache();
    $cache->endDataCache(['kg', 'g']);
}

$taggedCache->clearByTag('vendor_units');

echo var_export($application->getCache()->initCache(3600, 'units', $dir), true);
```

Код выведет `false`, потому что сброс тега удалил кеш.

## Смотрите также

- [Application::getManagedCache](get-managed-cache.md)
- [Кеширование](../../../performance/caching.md)
