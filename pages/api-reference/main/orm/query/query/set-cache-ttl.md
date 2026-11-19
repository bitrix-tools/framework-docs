---
title: Включить кеш выборок Query::setCacheTtl
description: Метод Query::setCacheTtl включает кеш выборок для запроса на заданное время.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setCacheTtl` включает кеш выборок для запроса. Метод [exec](exec.md) сначала ищет результат в кеше выборок сущности и выполняет запрос, только если записи нет. Ключ записи — хеш текста SQL. В `getList` кеш включает ключ `ttl` параметра `cache`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setCacheTtl($ttl)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| ttl\* | `int` | Задает время жизни кеша в секундах. Значение `0` выключает кеш |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

- Для запросов со связями кеш работает, только если включен [cacheJoins](cache-joins.md).
- Настройки таблицы и [Entity::getCacheTtl](../../entity/get-cache-ttl.md) ограничивают время жизни кеша.
- Методы `add`, `update` и `delete` класса таблицы очищают кеш выборок сами.

## Примеры

**Пример.** Код выполняет запрос с кешем на час:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->setOrder('LID')->setCacheTtl(3600)->fetchAll();

echo implode(',', array_column($rows, 'LID'));
LanguageTable::cleanCache();
```

Код выведет коды языков через запятую, например `en,ru`.

## Смотрите также

- [Query::cacheJoins](cache-joins.md)
- [Entity::readFromCache](../../entity/read-from-cache.md)
