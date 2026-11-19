---
title: Получить интервал между датами Date::getDiff
description: Метод Date::getDiff возвращает объект \DateInterval между датой объекта и другой датой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Date::getDiff` возвращает интервал от даты текущего объекта до переданной даты. Метод передает даты в метод `diff` стандартного класса `\DateTime`.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public function getDiff(Date $time)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| time\* | `Bitrix\Main\Type\Date` | Задает вторую дату. Метод принимает и объект `DateTime` |

## Возвращаемое значение

Метод возвращает объект `\DateInterval`. Свойство `days` содержит полное число дней между датами. Если переданная дата раньше даты объекта, свойство `invert` равно `1`, иначе `0`.

Для объекта `DateTime` метод учитывает и время. Например, интервал от даты `2026-01-01` до `2026-01-10 15:00:00` равен девяти дням и 15 часам.

## Примеры

**Пример.** Код считает число дней до срока и проверяет, не прошел ли срок:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$today = new Date('2026-01-01', 'Y-m-d');
$deadline = new Date('2026-01-10', 'Y-m-d');

$interval = $today->getDiff($deadline);

echo $interval->invert ? 'Срок прошел' : 'Осталось дней: ' . $interval->days;
```

Код выведет `Осталось дней: 9`.

## Смотрите также

- [Date::add](add.md)
