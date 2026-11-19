---
title: Записать выборку в кеш Entity::writeToCache
description: Метод Entity::writeToCache читает все строки результата выборки и сохраняет их в управляемый кеш.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::writeToCache` читает все строки результата выборки и сохраняет их в управляемый кеш. Запрос ORM вызывает метод сам после [readFromCache](read-from-cache.md), если в кеше записи не было.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function writeToCache(Main\DB\Result $result, $cacheId, $countTotal = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| result\* | `Bitrix\Main\DB\Result` | Задает результат выборки |
| cacheId\* | `string` | Задает ключ записи |
| countTotal | `bool` | Значение `true` сохраняет и общее число записей. По умолчанию — `false` |

Тип `cacheId` и `countTotal` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\ArrayResult` со строками выборки.

## Особенности

- Метод сохранит запись, только если раньше в этом хите [readFromCache](read-from-cache.md) обратился к тому же ключу. Иначе метод вернет результат, но в кеш его не запишет.
- Управляемый кеш пишет записи на диск в конце хита.

## Примеры

**Пример.** Код пишет выборку в кеш и читает ее снова:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();
$entity->readFromCache(3600, 'vendor_languages');
$entity->writeToCache(LanguageTable::getList(['select' => ['LID'], 'order' => ['LID' => 'ASC']]), 'vendor_languages');

$cached = $entity->readFromCache(3600, 'vendor_languages');

echo get_class($cached) . ' ' . count($cached->fetchAll());
$entity->cleanCache();
```

Код выведет `Bitrix\Main\DB\ArrayResult` и число языков, например `Bitrix\Main\DB\ArrayResult 2`.

## Смотрите также

- [Entity::readFromCache](read-from-cache.md)
