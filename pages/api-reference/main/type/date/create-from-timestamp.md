---
title: Создать дату из метки времени Unix Date::createFromTimestamp
description: Метод Date::createFromTimestamp создает объект Date из метки времени Unix и сбрасывает время на полночь.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.0

{% endnote %}

Метод `Date::createFromTimestamp` создает объект `Date` из метки времени Unix. Метод определяет дату в часовом поясе сервера и выставляет время `00:00:00`.

Аналог в классическом API — функция `ConvertTimeStamp`, она возвращает дату строкой в формате региональных настроек.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public static function createFromTimestamp($timestamp)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| timestamp\* | `int` | Задает метку времени Unix |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект того класса, у которого его вызвали. Дата зависит от часового пояса сервера. Если в UTC и в поясе сервера разные сутки, одна метка дает разные даты.

Класс `DateTime` переопределяет метод и сохраняет время. Подробнее — на странице [DateTime](../date-time/index.md#наследование).

## Примеры

**Пример.** Код создает дату из метки времени и выводит ее:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = Date::createFromTimestamp(1768478400);

echo $date->format('Y-m-d H:i:s');
```

Метка `1768478400` соответствует 15 января 2026 года 12:00 по UTC. Код выведет `2026-01-15 00:00:00`.

## Смотрите также

- [Date::getTimestamp](get-timestamp.md)
- [Date::createFromPhp](create-from-php.md)
