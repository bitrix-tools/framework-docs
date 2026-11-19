---
title: Перевести объект в другой часовой пояс DateTime::setTimeZone
description: Метод DateTime::setTimeZone переводит объект в другой часовой пояс и не меняет момент времени.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `DateTime::setTimeZone` переводит объект в другой часовой пояс и возвращает тот же объект. Метод не меняет момент времени и метку Unix, а пересчитывает время на часах. Например, 12:00 в поясе `+03:00` становится 09:00 в поясе UTC.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function setTimeZone(\DateTimeZone $timezone)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| timezone\* | `\DateTimeZone` | Задает новый часовой пояс |

## Возвращаемое значение

Метод возвращает текущий объект.

Если у объекта включен перевод во время пользователя и на сайте включены часовые пояса, метод [toString](../date/to-string.md) выводит время пользователя и не учитывает пояс объекта. Чтобы вывести время в поясе объекта, используйте [format](../date/format.md).

## Примеры

**Пример.** Код переводит время из пояса сервера в UTC:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime('2026-01-15 12:00:00', 'Y-m-d H:i:s', new \DateTimeZone('Europe/Moscow'));
$time->setTimeZone(new \DateTimeZone('UTC'));

echo $time->format('Y-m-d H:i:s P');
```

Код выведет `2026-01-15 09:00:00 +00:00`.

## Смотрите также

- [DateTime::setDefaultTimeZone](set-default-time-zone.md)
- [DateTime::getTimeZone](get-time-zone.md)
