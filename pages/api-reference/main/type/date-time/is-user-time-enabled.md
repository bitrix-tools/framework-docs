---
title: Проверить перевод во время пользователя DateTime::isUserTimeEnabled
description: Метод DateTime::isUserTimeEnabled проверяет, переводит ли метод toString время объекта во время пользователя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::isUserTimeEnabled` проверяет, включен ли у объекта перевод во время пользователя. Флаг влияет на метод [toString](../date/to-string.md) и на приведение объекта к строке.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function isUserTimeEnabled()
```

## Возвращаемое значение

Метод возвращает `true`, если перевод включен, и `false`, если его отключили методом [disableUserTime](disable-user-time.md). У нового объекта перевод включен.

Метод не учитывает настройки сайта. Метод `toString` переводит время, только если флаг включен, на сайте включены часовые пояса и код не отключил их методом `CTimeZone::Disable`.

Поле ORM [DatetimeField](../../orm/fields/datetime-field/index.md) задает флаг у значения по настройке [configureUseTimezone](../../orm/fields/datetime-field/configure-use-timezone.md).

## Примеры

**Пример.** Код проверяет флаг до и после отключения перевода:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime();
$before = $time->isUserTimeEnabled();
$time->disableUserTime();

var_dump($before, $time->isUserTimeEnabled());
```

Код выведет `bool(true)` и `bool(false)`.

## Смотрите также

- [DateTime::disableUserTime](disable-user-time.md)
- [DateTime::enableUserTime](enable-user-time.md)
