---
title: Задать сортировку объединения Query::setUnionOrder
description: Метод Query::setUnionOrder задает сортировку всего результата UNION.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setUnionOrder` задает сортировку всего результата объединения. Формат тот же, что у [setOrder](set-order.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setUnionOrder($order)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| order\* | `string` или `array` | Задает поле или массив `поле => направление` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Сортируйте по полям выборки первого запроса. Запрос подставит их псевдонимы.

## Примеры

**Пример.** Код сортирует объединение по убыванию кода:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->where('LID', 'en')
    ->union(LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru'))
    ->setUnionOrder(['LID' => 'DESC'])
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru,en`.

## Смотрите также

- [Query::addUnionOrder](add-union-order.md)
- [Query::union](union.md)
