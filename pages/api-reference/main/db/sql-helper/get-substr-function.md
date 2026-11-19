---
title: Получить подстроку в SQL SqlHelper::getSubstrFunction
description: Метод SqlHelper::getSubstrFunction возвращает SQL-выражение, которое берет часть строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::getSubstrFunction` возвращает выражение `SUBSTR`, которое берет часть строки. Реализации MySQL и PostgreSQL используют метод базового класса. Аналог в классическом API — `CDatabase::Substr`.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function getSubstrFunction($str, $from, $length = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| str\* | `string` | Задает колонку или SQL-выражение. Метод подставляет значение в SQL без экранирования |
| from\* | `int` | Задает начальную позицию. Метод подставляет значение в SQL без экранирования |
| length | `int`, `null` | Задает наибольшую длину подстроки. Метод подставляет значение в SQL без экранирования. По умолчанию — `null`, подстрока до конца строки |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает строку `string` — `SUBSTR(<str>, <from>)` или `SUBSTR(<str>, <from>, <length>)`.

## Примеры

**Пример.** Код выбирает первые три символа логина:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$connection = Application::getConnection();
$helper = $connection->getSqlHelper();

echo $connection->queryScalar(
    'SELECT ' . $helper->getSubstrFunction('LOGIN', 1, 3)
    . ' FROM ' . $helper->quote(UserTable::getTableName()) . ' ORDER BY ID'
);
```

## Смотрите также

- [SqlHelper::getLengthFunction](get-length-function.md)
- [SqlHelper::getConcatFunction](get-concat-function.md)
