---
title: Включить перевод во время пользователя DateTime::enableUserTime
description: Метод DateTime::enableUserTime снова включает у объекта перевод во время пользователя при выводе методом toString.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::enableUserTime` включает у объекта перевод во время пользователя и возвращает тот же объект. У нового объекта перевод уже включен. Метод нужен, чтобы вернуть перевод после [disableUserTime](disable-user-time.md).

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function enableUserTime()
```

## Возвращаемое значение

Метод возвращает текущий объект.

Метод меняет только флаг объекта. Метод [toString](../date/to-string.md) переводит время, если на сайте включены часовые пояса и код не отключил их методом `CTimeZone::Disable`.

## Примеры

**Пример.** Код отключает перевод у объекта и включает его снова:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = (new DateTime('2026-01-15 12:00:00', 'Y-m-d H:i:s'))->disableUserTime();
$time->enableUserTime();

var_dump($time->isUserTimeEnabled());
```

Код выведет `bool(true)`.

## Смотрите также

- [DateTime::disableUserTime](disable-user-time.md)
- [DateTime::isUserTimeEnabled](is-user-time-enabled.md)
