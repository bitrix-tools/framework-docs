---
title: Задать общее число строк Result::setCount
description: Метод ORM\Query\Result::setCount задает общее число строк, которое вернет getCount.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setCount` задает общее число строк, которое вернет [getCount](get-count.md). Метод вызывает [DB\Result::setCount](../../../db/result/set-count.md). При параметре `count_total` запрос сам задает число у внутреннего результата базы данных, и `getCount` возвращает его.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setCount($n)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| n\* | `int` | Задает число строк |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код задает число строк, посчитанное отдельно:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = ['@LID' => ['en', 'ru']];
$result = LanguageTable::getList(['select' => ['LID'], 'filter' => $filter, 'limit' => 1]);
$result->setCount(LanguageTable::getCount($filter));

echo $result->getCount();
```

Код выведет `2`.

## Смотрите также

- [Result::getCount](get-count.md)
