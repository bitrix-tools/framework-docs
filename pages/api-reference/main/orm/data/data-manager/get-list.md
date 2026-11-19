---
title: Выбрать записи DataManager::getList
description: Метод DataManager::getList выбирает записи таблицы по параметрам select, filter, order, limit и другим и возвращает результат ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DataManager::getList` выбирает записи таблицы по параметрам. Метод создает запрос [query](query.md), передает в него параметры и выполняет его.

Сигнатура метода в классе `Bitrix\Main\ORM\Data\DataManager`:

```php
public static function getList(array $parameters = array())
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| parameters | `array` | Задает параметры запроса. Ключи перечислены ниже. По умолчанию — пустой массив, метод выбирает все записи со всеми полями |

Ключи массива `parameters`:

| Ключ | Описание |
| --- | --- |
| `select` | Поля для выборки, например `['ID', 'NAME']`. Ключ массива задает псевдоним, например `['TITLE' => 'NAME']`. Значение `'*'` выбирает скалярные поля таблицы без закрытых полей, выражений и `UF_*`, значение `'UF_*'` — пользовательские поля. По умолчанию — `['*']` |
| `filter` | Условия отбора, например `['=ACTIVE' => 'Y', '>SORT' => 100]`, или объект `Bitrix\Main\ORM\Query\Filter\ConditionTree` |
| `order` | Сортировка, например `['SORT' => 'ASC']` |
| `group` | Поля для группировки |
| `limit`, `offset` | Число записей и смещение |
| `count_total` | Значение `true` включает подсчет общего числа записей для `getCount` результата |
| `runtime` | Поля, которые нужны только в этом запросе, например [ExpressionField](../../fields/expression-field/index.md) |
| `cache` | Настройки кеша. Ключ `ttl` задает время жизни в секундах, `cache_joins` разрешает кешировать запросы со связями |
| `data_doubling` | Значение `false` убирает дубли строк, когда условие `filter` идет через связь один ко многим. Метод превращает такое условие в подзапрос. На поля в `select` параметр не влияет |
| `private_fields` | Значение `true` разрешает указать закрытые поля в `select`. Фильтр по закрытому полю все равно выбросит исключение |

## Возвращаемое значение

Метод возвращает объект [Result](../../query/result/index.md). Методы `fetch`, `fetchAll`, `fetchObject` и `fetchCollection` читают записи.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Передан неизвестный ключ, например `where`, или поле, которого нет в таблице |
| `Bitrix\Main\SystemException` | ORM не смогла построить запрос |

## Примеры

**Пример.** Код выбирает языки с сортировкой и псевдонимом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList([
    'select' => ['LID', 'TITLE' => 'NAME'],
    'filter' => ['@LID' => ['en', 'ru'], '=ACTIVE' => 'Y'],
    'order' => ['LID' => 'ASC'],
]);

while ($row = $result->fetch())
{
    echo $row['LID'] . '=' . $row['TITLE'] . ' ';
}
```

Код выведет `en=English ru=Russian`.

## Смотрите также

- [Result](../../query/result/index.md)
- [DataManager::query](query.md)
- [Выборка данных](../../../../../orm/querying-data.md)
