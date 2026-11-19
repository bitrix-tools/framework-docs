---
title: Преобразовать дату и время для SQL SqlHelper::convertToDbDateTime
description: Метод SqlHelper::convertToDbDateTime превращает объект даты и времени в литерал SQL в часовом поясе сервера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbDateTime` превращает объект даты и времени в литерал SQL. Время объекта `DateTime` метод переводит в часовой пояс PHP по умолчанию и не меняет исходный объект.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbDateTime($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `Bitrix\Main\Type\Date`, `null` | Задает дату и время. Для объекта `Date` без времени метод подставляет время `00:00:00` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`. Для пустого значения — `NULL`. Для объекта — результат [getCharToDateFunction](get-char-to-date-function.md) с датой и временем в формате `Y-m-d H:i:s`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentTypeException` | Код передал непустое значение, но не объект `Bitrix\Main\Type\Date` |

## Примеры

**Пример.** Код готовит дату и время для условия запроса:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$helper = Application::getConnection()->getSqlHelper();

echo 'LAST_LOGIN >= ' . $helper->convertToDbDateTime(new DateTime('2024-01-01 09:30:00', 'Y-m-d H:i:s'));
```

## Смотрите также

- [SqlHelper::convertToDbDate](convert-to-db-date.md)
- [SqlHelper::convertFromDbDateTime](convert-from-db-date-time.md)
