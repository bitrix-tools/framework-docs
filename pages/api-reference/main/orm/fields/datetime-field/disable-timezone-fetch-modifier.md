---
title: Отключить перевод в часовой пояс у значения DatetimeField::disableTimezoneFetchModifier
description: Метод DatetimeField::disableTimezoneFetchModifier отключает перевод в часовой пояс пользователя у значения, которое выбрал ORM.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DatetimeField::disableTimezoneFetchModifier` отключает перевод в часовой пояс пользователя у значения из выборки. Поле подключает метод как модификатор выборки само, если перевод отключили методом [configureUseTimezone](configure-use-timezone.md). Чтобы подключить модификатор к другому полю, которое возвращает `DateTime`, передайте его в метод `addFetchDataModifier` этого поля.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\DatetimeField`:

```php
public static function disableTimezoneFetchModifier($time)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| time\* | `Bitrix\Main\Type\DateTime`, `null` | Задает значение из выборки |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `DateTime` с отключенным переводом в часовой пояс пользователя. Для `null` метод возвращает `null`.

## Примеры

**Пример.** Код отключает перевод у объекта и выводит настройку:

```php
<?php
use Bitrix\Main\ORM\Fields\DatetimeField;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = DatetimeField::disableTimezoneFetchModifier(new DateTime());

var_dump($time->isUserTimeEnabled());
```

Код выведет `bool(false)`.

## Смотрите также

- [DatetimeField::configureUseTimezone](configure-use-timezone.md)
