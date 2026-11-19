---
title: Очистить кеш выборок DataManager::cleanCache
description: Метод DataManager::cleanCache удаляет кеш выборок getList таблицы. Методы записи вызывают его сами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::cleanCache` удаляет кеш выборок таблицы — результаты `getList` с параметром `cache`. Методы [add](add.md), [update](update.md) и [delete](delete.md) вызывают его сами после записи. Вызывайте метод, если код меняет таблицу в обход ORM, например прямым SQL-запросом.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function cleanCache(): void
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод ничего не делает, если [isCacheable](is-cacheable.md) возвращает `false` или кеш ORM отключен в настройках.

## Примеры

**Пример.** Код кеширует выборку и очищает кеш:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => ['=LID' => 'en'],
    'cache' => ['ttl' => 3600],
])->fetch();

LanguageTable::cleanCache();

echo $row['LID'];
```

Код выведет `en`.

## Смотрите также

- [DataManager::isCacheable](is-cacheable.md)
- [DataManager::getList](get-list.md)
