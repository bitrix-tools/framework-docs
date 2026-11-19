---
title: Разрешить кеш выборок для запросов со связями Query::cacheJoins
description: Метод Query::cacheJoins разрешает кеш выборок для запросов, которые соединяют таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

Метод `Query::cacheJoins` разрешает кеш выборок для запросов, которые соединяют таблицы. По умолчанию такие запросы не используют кеш. Изменение связанной таблицы не очищает кеш основной, поэтому результат может устареть. В `getList` тот же режим включает ключ `cache_joins` параметра `cache`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function cacheJoins($mode)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| mode\* | `bool` | Значение `true` разрешает кеш |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код кеширует запрос со связью пользователя и языка:

```php
<?php
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = UserTable::query()
    ->setSelect(['ID', 'LANGUAGE_NAME' => 'ACTIVE_LANGUAGE.NAME'])
    ->setLimit(1)
    ->setCacheTtl(3600)
    ->cacheJoins(true)
    ->fetchAll();

echo count($rows);
UserTable::cleanCache();
```

Код выведет `1`.

## Смотрите также

- [Query::setCacheTtl](set-cache-ttl.md)
