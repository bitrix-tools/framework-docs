---
title: Преобразовать дробное число для SQL SqlHelper::convertToDbFloat
description: Метод SqlHelper::convertToDbFloat приводит значение к числу с плавающей точкой и возвращает его в одинарных кавычках.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbFloat` приводит значение к числу с плавающей точкой и возвращает литерал SQL в одинарных кавычках.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbFloat($value, $scale = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение |
| scale | `int`, `null` | Задает число знаков после точки для округления. По умолчанию — `null`, без округления |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — число в одинарных кавычках, например `'1.5'`. Бесконечность и `NAN` метод заменяет на `0`.

## Примеры

**Пример.** Код готовит значение с округлением до двух знаков:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->convertToDbFloat('3.14159', 2);
```

Код выведет `'3.14'`.

## Смотрите также

- [SqlHelper::convertFromDbFloat](convert-from-db-float.md)
