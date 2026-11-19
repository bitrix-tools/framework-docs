---
title: Добавить поле сортировки объединения Query::addUnionOrder
description: Метод Query::addUnionOrder добавляет поле в сортировку всего результата UNION.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::addUnionOrder` добавляет поле в сортировку всего результата объединения. Формат тот же, что у [addOrder](add-order.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function addUnionOrder($definition, $order = 'ASC')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| definition\* | `string` | Задает поле |
| order | `string` | Задает направление — `ASC` или `DESC`. По умолчанию — `'ASC'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Направление не `ASC` и не `DESC` |

## Примеры

**Пример.** Код добавляет поле сортировки объединения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])
    ->union(LanguageTable::query()->setSelect(['LID']))
    ->addUnionOrder('LID', 'DESC')
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru,en`.

## Смотрите также

- [Query::setUnionOrder](set-union-order.md)
