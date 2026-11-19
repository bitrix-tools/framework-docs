---
title: Преобразовать строку из базы данных SqlHelper::convertFromDbString
description: Метод SqlHelper::convertFromDbString приводит значение из базы данных к строке и обрезает ее до заданной длины.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbString` приводит значение из базы данных к строке PHP. Если код передал `length`, метод обрезает строку.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbString($value, $length = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |
| length | `int`, `null` | Задает наибольшую длину строки в символах. По умолчанию — `null`, без ограничения |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string`.

## Примеры

**Пример.** Код обрезает значение до двух символов:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getSqlHelper()->convertFromDbString('kgs', 2));
```

## Смотрите также

- [SqlHelper::convertToDbString](convert-to-db-string.md)
