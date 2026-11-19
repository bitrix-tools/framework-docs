---
title: Отключить перевод во время пользователя DateTime::disableUserTime
description: Метод DateTime::disableUserTime отключает у объекта перевод во время пользователя при выводе методом toString.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::disableUserTime` отключает у объекта перевод во время пользователя и возвращает тот же объект. После вызова метод [toString](../date/to-string.md) и приведение к строке выводят время в поясе объекта.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function disableUserTime()
```

## Возвращаемое значение

Метод возвращает текущий объект.

Метод меняет только флаг объекта. Копия объекта, созданная оператором `clone`, получает тот же флаг. Метод [toUserTime](to-user-time.md) флаг не учитывает.

## Примеры

**Пример.** Код выводит время сервера в формате региональных настроек, например для журнала:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime('2026-01-15 12:00:00', 'Y-m-d H:i:s');

echo $time->disableUserTime()->toString();
```

При формате `DD.MM.YYYY HH:MI:SS` в региональных настройках код выведет `15.01.2026 12:00:00` в любом часовом поясе пользователя.

## Смотрите также

- [DateTime::enableUserTime](enable-user-time.md)
- [DateTime::isUserTimeEnabled](is-user-time-enabled.md)
- [DatetimeField::configureUseTimezone](../../orm/fields/datetime-field/configure-use-timezone.md)
