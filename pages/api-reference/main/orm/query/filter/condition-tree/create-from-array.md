---
title: Создать дерево из массива ConditionTree::createFromArray
description: Статический метод ConditionTree::createFromArray создает дерево условий из массива с ключами logic, negative и условиями-массивами.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `ConditionTree::createFromArray` создает дерево условий из массива. Формат нужен, когда фильтр хранят в настройках или передают из JavaScript, например в JSON.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public static function createFromArray($filter)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filter\* | `array` | Задает фильтр. Формат описан ниже |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

Формат массива `filter`.

- Ключ `logic` задает логику — `'and'` или `'or'`. Пишите ключ строчными. Ключ `LOGIC` метод не распознает и выбросит ошибку.
- Ключ `negative` со значением `true` ставит `NOT` перед деревом.
- Остальные элементы — условия. Условие — массив аргументов метода [where](where.md), например `['SORT', '>', 100]` или `['LID', 'en']`.
- Чтобы сравнить с другим полем, передайте вместо значения массив `['column' => 'LID']`, например `['NAME', '=', ['column' => 'LID']]`.
- Для `in` можно передать обычный массив значений. Чтобы метод не разбирал массив, оберните его в `['value' => [...]]`.
- Если элемент сам состоит из условий-массивов, метод разбирает его как вложенное дерево.

## Возвращаемое значение

Метод возвращает новый объект `ConditionTree`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Логика или оператор неизвестны |

## Примеры

**Пример.** Код создает фильтр `LID = 'en' OR (SORT = 1 AND ACTIVE = 'Y')` из массива:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Filter\ConditionTree;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = ConditionTree::createFromArray([
    'logic' => 'or',
    ['LID', 'en'],
    [['SORT', '=', 1], ['ACTIVE', '=', 'Y']],
]);

$rows = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter, 'order' => ['LID' => 'ASC']])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en,ru`.

## Смотрите также

- [ConditionTree::where](where.md)
- [ConditionTree::logic](logic.md)
