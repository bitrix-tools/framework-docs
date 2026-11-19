---
title: Получить метку времени Unix Date::getTimestamp
description: Метод Date::getTimestamp возвращает метку времени Unix для даты объекта.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `Date::getTimestamp` возвращает метку времени Unix — число секунд с 1 января 1970 года по UTC.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public function getTimestamp()
```

## Возвращаемое значение

Метод возвращает целое число.

Объект `Date`, созданный конструктором или методом [createFromTimestamp](create-from-timestamp.md), хранит полночь в часовом поясе сервера. Поэтому метка одной и той же даты зависит от часового пояса сервера.

## Примеры

**Пример.** Код получает метку времени для 15 января 2026 года:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = new Date('2026-01-15', 'Y-m-d');

echo $date->getTimestamp();
```

При часовом поясе сервера `Europe/Moscow` код выведет `1768424400`.

## Смотрите также

- [Date::createFromTimestamp](create-from-timestamp.md)
