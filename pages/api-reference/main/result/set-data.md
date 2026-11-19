---
title: Сохранить данные результата Result::setData
description: Метод Result::setData заменяет данные результата массивом и пропускает значения SqlExpression.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setData` сохраняет данные результата, например идентификатор созданной записи. Метод заменяет прежние данные целиком.

Сигнатура метода в классе `Bitrix\Main\Result`:

```php
public function setData(array $data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `array` | Задает данные результата |

## Возвращаемое значение

Метод возвращает тот же объект результата, поэтому вызов можно продолжить цепочкой.

## Особенности

Метод не сохраняет элементы верхнего уровня массива, которые содержат объект [SqlExpression](../db/sql-expression/index.md). Во вложенных массивах метод такие объекты не ищет.

## Примеры

**Пример.** Код сохраняет в результат идентификатор и код единицы измерения:

```php
<?php
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = (new Result())->setData(['ID' => 5, 'CODE' => 'kg']);

echo $result->getData()['CODE'];
```

Код выведет `kg`.

## Смотрите также

- [Result::getData](get-data.md)
