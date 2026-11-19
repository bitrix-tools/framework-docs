---
title: Добавить поле сортировки Query::addOrder
description: Метод Query::addOrder добавляет поле в сортировку ORDER BY.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::addOrder` добавляет поле в сортировку. Прежние поля остаются, новое поле идет после них. Если поле уже есть в сортировке, метод меняет его направление и оставляет на прежнем месте.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function addOrder($definition, $order = 'ASC')
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| definition\* | `string` | Задает поле |
| order | `string` | Задает направление — `ASC` или `DESC` в любом регистре. По умолчанию — `'ASC'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Направление не строка — текст `Order must be a string`. Направление не `ASC` и не `DESC` — текст `Invalid order "<направление>"` |

## Примеры

**Пример.** Код пробует добавить неверное направление:

```php
<?php
use Bitrix\Main\ArgumentException;
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    LanguageTable::query()->addOrder('LID', 'UP');
}
catch (ArgumentException $exception)
{
    echo $exception->getMessage();
}
```

Код выведет `Invalid order "UP"`.

## Смотрите также

- [Query::setOrder](set-order.md)
