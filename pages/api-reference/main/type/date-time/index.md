---
title: DateTime — дата и время
description: Класс Bitrix\Main\Type\DateTime хранит дату со временем и часовым поясом и переводит время сервера во время пользователя.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Type`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 12.0.7

{% endnote %}

## Когда использовать

Класс `DateTime` хранит дату со временем и часовым поясом. ORM возвращает объект `DateTime` для полей [DatetimeField](../../orm/fields/datetime-field/index.md) и принимает его при записи.

Конструктор без параметра `timezone` создает объект в часовом поясе сервера. При выводе в формате региональных настроек метод `toString` переводит время в часовой пояс пользователя, если на сайте включены часовые пояса. Метод [toUserTime](to-user-time.md) переводит время объекта во время пользователя, метод [createFromUserTime](create-from-user-time.md) создает объект из времени, которое ввел пользователь.

Для даты без времени используйте родительский класс [Date](../date/index.md).

Подробнее — в статье [Дата и время](../../../../advanced/datetime.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [setTime](set-time.md) | Устанавливает время | |
| [getTimeZone](get-time-zone.md) | Возвращает часовой пояс объекта | |
| [setTimeZone](set-time-zone.md) | Переводит объект в другой часовой пояс | 14.0.18 |
| [setDefaultTimeZone](set-default-time-zone.md) | Переводит объект в часовой пояс сервера | 14.0.18 |
| [getOffset](get-offset.md) | Возвращает смещение часового пояса объекта от UTC в секундах | |
| [secondsToOffset](seconds-to-offset.md) | Переводит смещение в секундах в строку вида `+0300` | |
| [toUserTime](to-user-time.md) | Переводит время объекта во время пользователя | 14.0.18 |
| [createFromUserTime](create-from-user-time.md) | Создает объект из времени пользователя | 14.0.18 |
| [tryParse](try-parse.md) | Создает объект из строки или возвращает `null` | |
| [isUserTimeEnabled](is-user-time-enabled.md) | Проверяет, переводит ли `toString` время во время пользователя | |
| [disableUserTime](disable-user-time.md) | Отключает перевод во время пользователя в `toString` | |
| [enableUserTime](enable-user-time.md) | Включает перевод во время пользователя в `toString` | |

## Наследование

Класс наследует [Date](../date/index.md).

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| [__construct](../date/construct.md) | Сигнатура `__construct($time = null, $format = null, ?\DateTimeZone $timezone = null)`. Без строки создает текущие дату и время, а не полночь. Без формата берет формат даты и времени из региональных настроек. Параметр `timezone` задает часовой пояс, в котором конструктор разбирает строку. Смещение в строке, например `+05:30`, задает часовой пояс объекта. Название пояса в строке, например `Europe/Berlin`, конструктор не учитывает. Сохраняет микросекунды из строки. Сообщение исключения — `Incorrect date/time: ` и переданная строка |
| [toString](../date/to-string.md) | Выводит дату и время в формате региональных настроек. Если перевод во время пользователя включен у объекта, на сайте включены часовые пояса и код не отключил их методом `CTimeZone::Disable`, выводит время пользователя. Сам объект не меняет |
| [createFromPhp](../date/create-from-php.md) | Сохраняет время и часовой пояс исходного объекта |
| [createFromTimestamp](../date/create-from-timestamp.md) | Сохраняет время. Создает объект в часовом поясе сервера. Доступен с версии 15.0.7 |

### Унаследованные методы

- Вывод, арифметика и установка даты — [format](../date/format.md), [add](../date/add.md), [setDate](../date/set-date.md), [getTimestamp](../date/get-timestamp.md), [getDiff](../date/get-diff.md) работают как в классе `Date`. Метод `add` сдвигает и время.
- Форматы и проверка строки — [getFormat](../date/get-format.md) и [isCorrect](../date/is-correct.md) у `DateTime` по умолчанию используют формат даты и времени.
- Разбор текста — метод [createFromText](../date/create-from-text.md) возвращает объект `DateTime` при вызове из любого из двух классов.

## Смотрите также

- [Дата и время](../../../../advanced/datetime.md)
- [Date](../date/index.md)
- [DatetimeField](../../orm/fields/datetime-field/index.md)
