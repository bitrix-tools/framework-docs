---
title: Получить часовой пояс объекта DateTime::getTimeZone
description: Метод DateTime::getTimeZone возвращает часовой пояс объекта объектом PHP \DateTimeZone.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::getTimeZone` возвращает часовой пояс объекта.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function getTimeZone()
```

## Возвращаемое значение

Метод возвращает объект стандартного класса PHP `\DateTimeZone`. Для объекта без заданного часового пояса метод возвращает пояс сервера, например `Europe/Moscow`. Если строка конструктора содержит смещение, имя пояса — это смещение, например `+05:30`.

## Примеры

**Пример.** Код выводит имя часового пояса у объекта с поясом UTC:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime('2026-01-15 12:00:00', 'Y-m-d H:i:s', new \DateTimeZone('UTC'));

echo $time->getTimeZone()->getName();
```

Код выведет `UTC`.

## Смотрите также

- [DateTime::setTimeZone](set-time-zone.md)
- [DateTime::getOffset](get-offset.md)
