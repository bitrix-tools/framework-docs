---
title: Распознать дату в тексте Date::createFromText
description: Метод Date::createFromText находит в тексте числовую дату или слово из словаря текущего языка, например «завтра», и возвращает объект DateTime.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Date::createFromText` находит в тексте дату и возвращает ее объектом [DateTime](../date-time/index.md). Метод распознает числовые даты и слова из словаря текущего языка, например «завтра» или «вчера» на русском, `tomorrow` или `yesterday` на английском.

Метод передает текст в метод `Bitrix\Main\Text\DateConverter::decode` и берет первый элемент результата. Порядок элементов задают приоритеты видов дат в `DateConverter`, а не позиция в тексте.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public static function createFromText($text)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| text\* | `string` | Задает текст, в котором метод ищет дату |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `DateTime`, а не `Date`, в том числе при вызове `Date::createFromText`. Если текст пустой или даты в нем нет, метод возвращает `null`.

## Особенности

- Словарь зависит от текущего языка. На сайте это язык сайта, в административном разделе — язык интерфейса. На русском языке метод не распознает слово `tomorrow`.
- Если в тексте нет времени, метод подставляет время по виду даты. Для слова «завтра» и даты без времени метод берет время окончания рабочего дня, для части других фраз — время начала рабочего дня, для середины периода — `14:00`. Время начала и окончания метод читает из параметров `work_time_start` и `work_time_end` модуля `calendar`, без них берет `9:00` и `18:00`.

## Примеры

**Пример.** Код распознает дату со временем и дату без времени:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$withTime = Date::createFromText('15.01.2026 10:30');
$withoutTime = Date::createFromText('15.01.2026');

echo $withTime?->format('Y-m-d H:i') . ' ' . $withoutTime?->format('Y-m-d H:i');
```

Без параметров рабочего времени модуля `calendar` код выведет `2026-01-15 10:30 2026-01-15 18:00`.

**Пример.** Код распознает слово «завтра» на русском языке и выводит класс и время результата:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = Date::createFromText('завтра');

echo $date === null ? 'Дата не найдена' : get_class($date) . ' ' . $date->format('H:i');
```

Без параметров рабочего времени модуля `calendar` код выведет `Bitrix\Main\Type\DateTime 18:00`. Дата в объекте — завтрашняя.

## Смотрите также

- [Date::__construct](construct.md)
- [DateTime::tryParse](../date-time/try-parse.md)
