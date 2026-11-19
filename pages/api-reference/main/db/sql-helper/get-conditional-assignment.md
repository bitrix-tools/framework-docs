---
title: Присвоить значение с проверкой хеша SqlHelper::getConditionalAssignment
description: Метод SqlHelper::getConditionalAssignment возвращает выражение CASE, которое сравнивает текущее значение колонки с новым по хешу SHA-1.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getConditionalAssignment` возвращает выражение `CASE` для правой части присваивания в `UPDATE`. Если хеш SHA-1 текущего значения колонки совпадает с хешем нового значения, выражение оставляет текущее значение. Иначе выражение возвращает новое значение.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getConditionalAssignment($field, string $value): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string`, `SqlExpression` | Задает колонку. Строку метод берет в кавычки через [quote](quote.md), объект `SqlExpression` подставляет собранным |
| value\* | `string` | Задает новое значение. Метод экранирует его и берет в кавычки |

Тип `field` в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` вида `case when <sha1(field)> = '<sha1(value)>' then <field> else '<value>' end`. Функцию хеша метод получает из [getSha1Function](get-sha1-function.md).

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных для экранирования не удалось |
| `Bitrix\Main\ArgumentException` | В `field` передан объект `SqlExpression` с ошибкой в значении для плейсхолдера `?@` |

## Примеры

**Пример.** Код выводит выражение для колонки `TITLE`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->getConditionalAssignment('TITLE', 'Kilogram');
```

## Смотрите также

- [SqlHelper::getSha1Function](get-sha1-function.md)
- [SqlHelper::prepareUpdate](prepare-update.md)
