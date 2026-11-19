---
title: Получить смещение часового пояса DateTime::getOffset
description: Метод DateTime::getOffset возвращает смещение часового пояса объекта от UTC в секундах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `DateTime::getOffset` возвращает смещение часового пояса объекта от UTC в секундах на дату объекта. Для поясов с летним временем смещение зависит от даты.

Сигнатура метода в классе `Bitrix\Main\Type\DateTime`:

```php
public function getOffset(): int
```

## Возвращаемое значение

Метод возвращает целое число секунд. Для пояса восточнее UTC число положительное, западнее — отрицательное. Например, для `Europe/Moscow` метод возвращает `10800`.

## Примеры

**Пример.** Код выводит смещение в секундах и строкой:

```php
<?php
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$time = new DateTime('2026-01-15T12:00:00+05:30', \DateTime::ATOM);
$offset = $time->getOffset();

echo $offset . ' ' . DateTime::secondsToOffset($offset, ':');
```

Код выведет `19800 +05:30`.

## Смотрите также

- [DateTime::secondsToOffset](seconds-to-offset.md)
- [DateTime::getTimeZone](get-time-zone.md)
