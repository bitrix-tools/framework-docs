---
title: Получить число записей DataManager::getCount
description: Метод DataManager::getCount выполняет запрос COUNT по фильтру и возвращает число записей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.10

{% endnote %}

Метод `DataManager::getCount` возвращает число записей таблицы по фильтру. Метод выполняет запрос `COUNT(1)` и не читает сами записи.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getCount($filter = array(), array $cache = array())
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter | `array` или `Bitrix\Main\ORM\Query\Filter\ConditionTree` | Задает условия отбора, как ключ `filter` в [getList](get-list.md). По умолчанию — пустой массив, метод считает все записи |
| cache | `array` | Задает кеш. Ключ `ttl` — время жизни в секундах. По умолчанию — пустой массив, без кеша |

Сигнатура PHP объявляет только тип `cache`.

## Возвращаемое значение

Метод возвращает целое число.

## Особенности

Метод учитывает условия [setDefaultScope](set-default-scope.md). Чтобы получить и страницу записей, и общее число одним вызовом, используйте `getList` с параметром `count_total`.

## Примеры

**Пример.** Код считает активные языки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::getCount(['@LID' => ['en', 'ru'], '=ACTIVE' => 'Y']);
```

Код выведет `2`.

## Смотрите также

- [DataManager::getList](get-list.md)
- [Result::getCount](../../query/result/get-count.md)
