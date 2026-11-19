---
title: Прочитать выборку из кеша Entity::readFromCache
description: Метод Entity::readFromCache читает результат выборки сущности из управляемого кеша.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Метод `Entity::readFromCache` читает результат выборки из управляемого кеша. Запрос ORM вызывает метод сам, если код передал в `getList` параметр `cache`. Для запроса со связями кеш работает, только если в `cache` задан `cache_joins` = `true`. Прикладной код вызывает метод, только если кеширует выборку вручную вместе с [writeToCache](write-to-cache.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function readFromCache($ttl, $cacheId, $countTotal = false)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ttl\* | `int` | Задает время жизни кеша в секундах. При значении `0` и меньше метод не читает кеш |
| cacheId\* | `string` | Задает ключ записи |
| countTotal | `bool` | Значение `true` читает и общее число записей. По умолчанию — `false` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\DB\ArrayResult` или `null`, если записи в кеше нет.

## Особенности

- Метод хранит записи в каталоге `orm_<имя таблицы>` управляемого кеша.
- Метод готовит ключ к сохранению. Вызывайте [writeToCache](write-to-cache.md) после этого метода, иначе запись не сохранится.
- С `countTotal` = `true` метод сначала читает ключ `<cacheId>.total`. Если его нет, метод возвращает `null` и не обращается к основному ключу. Тогда `writeToCache` в этом хите сохранит только число записей, а строки — со следующего хита.

## Примеры

**Пример.** Код кеширует выборку языков вручную:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();
$ttl = $entity->getCacheTtl(3600);

$result = $entity->readFromCache($ttl, 'vendor_languages');
if ($result === null)
{
    $result = $entity->writeToCache(LanguageTable::getList(['select' => ['LID'], 'order' => ['LID' => 'ASC']]), 'vendor_languages');
}

echo implode(',', array_column($result->fetchAll(), 'LID'));
$entity->cleanCache();
```

Код выведет коды языков через запятую, например `en,ru`.

## Смотрите также

- [Entity::writeToCache](write-to-cache.md)
- [Entity::getCacheTtl](get-cache-ttl.md)
- [Кеширование](../../../../performance/caching.md)
