---
title: Преобразовать целое число из базы данных SqlHelper::convertFromDbInteger
description: Метод SqlHelper::convertFromDbInteger приводит значение из базы данных к целому числу PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbInteger` приводит значение из базы данных к целому числу PHP функцией `intval`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbInteger($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает целое число `int`.

## Примеры

**Пример.** Код приводит строку из базы данных к целому числу:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getSqlHelper()->convertFromDbInteger('42'));
```

## Смотрите также

- [SqlHelper::convertToDbInteger](convert-to-db-integer.md)
