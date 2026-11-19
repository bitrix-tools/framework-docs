---
title: Создать дату из объекта PHP Date::createFromPhp
description: Метод Date::createFromPhp создает объект Date из копии объекта PHP \DateTime и сбрасывает время на полночь.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.0

{% endnote %}

Метод `Date::createFromPhp` создает объект `Date` из объекта стандартного класса PHP `\DateTime`. Метод копирует переданный объект и устанавливает в копии время `00:00:00`. Метод не меняет исходный объект.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public static function createFromPhp(\DateTime $datetime)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| datetime\* | `\DateTime` | Задает исходный объект. Метод не принимает объект `\DateTimeImmutable` |

## Возвращаемое значение

Метод возвращает объект того класса, у которого его вызвали. Объект сохраняет часовой пояс исходного объекта. Метод устанавливает полночь в этом поясе.

Класс `DateTime` переопределяет метод и сохраняет время. Подробнее — на странице [DateTime](../date-time/index.md#наследование).

## Примеры

**Пример.** Код создает дату из объекта PHP со временем:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$phpDate = new \DateTime('2026-01-15 13:45:00');
$date = Date::createFromPhp($phpDate);

echo $date->format('Y-m-d H:i:s') . ' ' . $phpDate->format('H:i');
```

Код выведет `2026-01-15 00:00:00 13:45`.

## Смотрите также

- [Date::createFromTimestamp](create-from-timestamp.md)
- [Date::__construct](construct.md)
