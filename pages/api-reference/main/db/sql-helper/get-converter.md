---
title: Получить функцию преобразования значения SqlHelper::getConverter
description: Метод SqlHelper::getConverter возвращает функцию, которой результат запроса преобразует значение колонки при выборке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.0.1

{% endnote %}

Метод `SqlHelper::getConverter` возвращает функцию, которой результат запроса преобразует значение колонки при выборке. Конструктор `Result` вызывает метод для каждой колонки и собирает список, который возвращает [Result::getConverters](../result/get-converters.md).

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getConverter(ORM\Fields\ScalarField $field)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `Bitrix\Main\ORM\Fields\ScalarField` | Задает поле ORM, которое описывает колонку |

## Возвращаемое значение

Метод возвращает функцию в виде массива `[объект, имя метода]` или `false`, если преобразование не нужно.

| Реализация | Функция |
| --- | --- |
| `SqlHelper` | Всегда `false` |
| `MysqliSqlHelper`, `PgsqlSqlHelper` | Для `DatetimeField` — [convertFromDbDateTime](convert-from-db-date-time.md), для `DateField` — [convertFromDbDate](convert-from-db-date.md), для остальных полей — `false` |

## Примеры

**Пример.** Код проверяет, нужна ли функция преобразования полю даты и времени:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\ORM\Fields\DatetimeField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$converter = Application::getConnection()->getSqlHelper()->getConverter(new DatetimeField('DATE_REGISTER'));

var_dump(is_callable($converter));
```

## Смотрите также

- [Result::getConverters](../result/get-converters.md)
- [SqlHelper::convertFromDbDateTime](convert-from-db-date-time.md)
