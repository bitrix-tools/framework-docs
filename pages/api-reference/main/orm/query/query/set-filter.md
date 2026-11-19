---
title: Задать фильтр-массив Query::setFilter
description: Метод Query::setFilter задает фильтр запроса в формате массива, как параметр filter в getList.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setFilter` задает фильтр в формате массива и заменяет прежний фильтр-массив. Формат тот же, что у параметра `filter` в `getList`. Ключ — поле с оператором, например `>=SORT`, значение — то, с чем сравнивают поле. Ключ `LOGIC` со значением `OR` объединяет условия группы через `OR`.

Для нового кода используйте методы `where*` — их описывает страница [ConditionTree](../filter/condition-tree/index.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setFilter(array $filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `array` | Задает фильтр — массив `оператор и поле => значение` |

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

- Фильтр-массив и условия `where*` работают вместе — SQL объединит их через `AND`.
- Ключ без оператора, например `NAME`, сравнивает строки через `LIKE` без учета регистра. Для точного совпадения используйте `=NAME`.

## Примеры

**Пример.** Код выбирает языки фильтром-массивом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()
    ->setSelect(['LID'])
    ->setFilter(['=ACTIVE' => 'Y', ['LOGIC' => 'OR', '=LID' => 'ru', '=CODE' => 'ru']])
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru`.

## Смотрите также

- [Query::addFilter](add-filter.md)
- [ConditionTree](../filter/condition-tree/index.md)
