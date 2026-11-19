---
title: Настроить перевод в часовой пояс DatetimeField::configureUseTimezone
description: Метод DatetimeField::configureUseTimezone включает или отключает перевод значения поля в часовой пояс пользователя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DatetimeField::configureUseTimezone` включает или отключает перевод значения поля в часовой пояс пользователя. По умолчанию перевод включен.

Перевод действует, когда объект `DateTime` выводится строкой и на сайте включены часовые пояса. Отключите перевод для значений, которые не зависят от часового пояса пользователя.

Сигнатура метода в классе `Bitrix\Main\ORM\Fields\DatetimeField`:

```php
public function configureUseTimezone($use = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| use | `bool` | Включает перевод при `true` и отключает при `false`. Метод приводит значение к `bool`. По умолчанию — `true` |

## Возвращаемое значение

Метод возвращает объект поля, поэтому вызов можно продолжить цепочкой.

## Особенности

Если перевод отключен, поле отключает его:

- у значений, которые выбирает ORM, через модификатор [disableTimezoneFetchModifier](disable-timezone-fetch-modifier.md),
- у объекта `DateTime`, который присваивают полю.

Если перевод включен, поле включает его у присвоенного объекта `DateTime`, даже если у объекта перевод отключили методом `disableUserTime`.

## Примеры

**Пример.** Код описывает поле без перевода в часовой пояс и проверяет, что у значения после `cast` перевод отключен:

```php
<?php
use Bitrix\Main\ORM\Fields\DatetimeField;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = (new DatetimeField('NEXT_RUN'))->configureUseTimezone(false);

$value = $field->cast(new DateTime());

var_dump($value->isUserTimeEnabled());
```

Код выведет `bool(false)`.

## Смотрите также

- [DatetimeField::disableTimezoneFetchModifier](disable-timezone-fetch-modifier.md)
