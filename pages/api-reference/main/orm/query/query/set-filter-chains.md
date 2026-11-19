---
title: Построить цепочки фильтра-массива Query::setFilterChains
description: Служебный метод Query::setFilterChains строит цепочки полей фильтра-массива и регистрирует их в разделе запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setFilterChains` строит цепочки полей фильтра-массива и регистрирует их в разделе запроса. Метод разбирает ключи фильтра, например `>=SORT`, и обходит вложенные группы. Запрос вызывает метод сам, когда строит SQL. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setFilterChains(&$filter, $section = 'filter')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `array` | Принимает фильтр-массив по ссылке. Метод может переименовать ключи множественных пользовательских полей |
| section | `string` | Задает раздел — `filter`, `where` или `having`. По умолчанию — `'filter'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код строит цепочки фильтра-массива и выводит их:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();
$filter = ['=ACTIVE' => 'Y', ['LOGIC' => 'OR', '>SORT' => 0, '=LID' => 'ru']];
$query->setFilterChains($filter);

echo implode(',', array_keys($query->getFilterChains()));
```

Код выведет `ACTIVE,SORT,LID`.

## Смотрите также

- [Query::setFilterHandlerChains](set-filter-handler-chains.md)
- [Query::getFilterChains](get-filter-chains.md)
