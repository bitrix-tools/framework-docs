---
title: Перевести объект в часовой пояс сервера DateTime::setDefaultTimeZone
description: Метод DateTime::setDefaultTimeZone переводит объект в часовой пояс PHP по умолчанию и не меняет момент времени.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `DateTime::setDefaultTimeZone` переводит объект в часовой пояс сервера и возвращает тот же объект. Пояс сервера — часовой пояс PHP по умолчанию, в котором конструктор создает объект без пояса. Метод не меняет момент времени.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function setDefaultTimeZone()
```

## Возвращаемое значение

Метод возвращает текущий объект.

Метод [toUserTime](to-user-time.md) вызывает этот метод перед переводом во время пользователя. Метод `SqlHelper::convertToDbDateTime` вызывает его для копии объекта перед записью в базу данных.

## Примеры

**Пример.** Код возвращает в пояс сервера время, созданное в поясе UTC:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime('2026-01-15 09:00:00', 'Y-m-d H:i:s', new \DateTimeZone('UTC'));
$time->setDefaultTimeZone();

echo $time->format('Y-m-d H:i:s P');
```

При часовом поясе сервера `Europe/Moscow` код выведет `2026-01-15 12:00:00 +03:00`.

## Смотрите также

- [DateTime::setTimeZone](set-time-zone.md)
- [DateTime::toUserTime](to-user-time.md)
