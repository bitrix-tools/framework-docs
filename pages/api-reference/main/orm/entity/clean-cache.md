---
title: Очистить кеш выборок Entity::cleanCache
description: Метод Entity::cleanCache удаляет все записи кеша выборок сущности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Метод `Entity::cleanCache` удаляет все записи кеша выборок сущности — каталог `orm_<имя таблицы>` управляемого кеша. Методы `add`, `update` и `delete` класса таблицы вызывают его сами через [DataManager::cleanCache](../data/data-manager/clean-cache.md).

Метод нужен, когда код меняет таблицу в обход ORM, например прямым SQL-запросом.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function cleanCache()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Если кеш таблицы выключен и [getCacheTtl](get-cache-ttl.md) возвращает `0`, метод ничего не делает.

## Примеры

**Пример.** Код меняет таблицу прямым запросом и очищает кеш:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$entity = LanguageTable::getEntity();
Application::getConnection()->query("UPDATE b_language SET SORT = SORT WHERE LID = 'ru'");
$entity->cleanCache();

echo 'cleaned';
```

Код выведет `cleaned`.

## Смотрите также

- [DataManager::cleanCache](../data/data-manager/clean-cache.md)
- [Entity::getCacheTtl](get-cache-ttl.md)
