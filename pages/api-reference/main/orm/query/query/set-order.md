---
title: Задать сортировку Query::setOrder
description: Метод Query::setOrder задает сортировку ORDER BY и заменяет прежнюю.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setOrder` задает сортировку `ORDER BY` и заменяет прежнюю.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setOrder($order)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| order\* | `string` или `array` | Задает поле, массив полей или массив `поле => направление`. Направление — `ASC` или `DESC` в любом регистре. Поле без направления запрос сортирует по возрастанию |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Направление не строка или не `ASC` и не `DESC` |

## Примеры

**Пример.** Код сортирует языки по убыванию кода:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->setOrder(['LID' => 'desc'])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `ru,en`.

## Смотрите также

- [Query::addOrder](add-order.md)
