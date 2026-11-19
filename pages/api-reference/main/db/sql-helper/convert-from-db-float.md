---
title: Преобразовать дробное число из базы данных SqlHelper::convertFromDbFloat
description: Метод SqlHelper::convertFromDbFloat приводит значение из базы данных к числу с плавающей точкой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbFloat` приводит значение из базы данных к числу с плавающей точкой. Если код передал `scale`, метод округляет число.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbFloat($value, $scale = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |
| scale | `int`, `null` | Задает число знаков после точки для округления. По умолчанию — `null`, без округления |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает число `float`.

## Примеры

**Пример.** Код приводит строку из базы данных к числу с округлением:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getSqlHelper()->convertFromDbFloat('2.71828', 3));
```

Код выведет `float(2.718)`.

## Смотрите также

- [SqlHelper::convertToDbFloat](convert-to-db-float.md)
