---
title: Преобразовать дату и время из базы данных SqlHelper::convertFromDbDateTime
description: Метод SqlHelper::convertFromDbDateTime превращает дату и время из базы данных в объект Bitrix\Main\Type\DateTime.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbDateTime` превращает дату и время из базы данных в объект `Bitrix\Main\Type\DateTime`. Метод [Result::fetch](../result/fetch.md) вызывает его для колонок даты и времени.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbDateTime($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string`, `null` | Задает дату и время из базы данных |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Type\DateTime` или `null`.

| Реализация | Результат |
| --- | --- |
| `SqlHelper` | Объект `DateTime`, созданный из строки в формате сайта. Для `null` — объект с текущими датой и временем |
| `MysqliSqlHelper`, `PgsqlSqlHelper` | Объект `DateTime` из строки формата `Y-m-d H:i:s`. Для `null` и `0000-00-00 00:00:00` — `null` |

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ObjectException` | Строку не удалось разобрать как дату и время |

## Примеры

**Пример.** Код превращает строку из базы данных в объект даты и времени:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$value = Application::getConnection()->getSqlHelper()->convertFromDbDateTime('2024-01-01 09:30:00');

echo $value->format('d.m.Y H:i');
```

## Смотрите также

- [SqlHelper::convertToDbDateTime](convert-to-db-date-time.md)
- [SqlHelper::getConverter](get-converter.md)
