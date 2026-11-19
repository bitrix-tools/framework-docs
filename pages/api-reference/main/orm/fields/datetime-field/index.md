---
title: DatetimeField — поле даты и времени ORM
description: Класс Bitrix\Main\ORM\Fields\DatetimeField описывает в getMap поле с датой и временем и хранит значение объектом Bitrix\Main\Type\DateTime.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\ORM\Fields`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 17.5.12

{% endnote %}

## Когда использовать

Поле `DatetimeField` описывает в методе `getMap` колонку с датой и временем. ORM возвращает значение поля объектом `Bitrix\Main\Type\DateTime` и принимает такой же объект при записи. Для колонки только с датой используйте `DateField`.

Собственные методы поля управляют переводом значения в часовой пояс пользователя и задают значение по умолчанию «текущее время».

Старое имя класса `Bitrix\Main\Entity\DatetimeField` работает как псевдоним.

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [configureUseTimezone](configure-use-timezone.md) | Включает или отключает перевод значения в часовой пояс пользователя | |
| [configureDefaultValueNow](configure-default-value-now.md) | Задает текущее время значением по умолчанию | |
| [disableTimezoneFetchModifier](disable-timezone-fetch-modifier.md) | Отключает перевод в часовой пояс пользователя у выбранного значения | |

## Наследование

Класс наследует `Bitrix\Main\ORM\Fields\DateField`, тот — `Bitrix\Main\ORM\Fields\ScalarField`.

### Реализация методов базового класса

| Метод | Особенность реализации |
| --- | --- |
| `__construct($name, $parameters = [])` | Не добавляет модификатор выборки `DateField`, который превращает значение в дату без времени. Параметр `parameters` — старый формат настроек, для нового кода используйте методы `configure*` |
| `cast` | Превращает в `Bitrix\Main\Type\DateTime` непустое значение другого типа. У объекта `DateTime` включает или отключает перевод в часовой пояс пользователя по настройке [configureUseTimezone](configure-use-timezone.md). Возвращает объект `SqlExpression` и пустые значения без изменений |
| `convertValueFromDb` | Превращает значение из базы данных в `DateTime` методом `SqlHelper::convertFromDbDateTime` |
| `convertValueToDb` | Превращает значение в строку для базы данных методом `SqlHelper::convertToDbDateTime`. Передает без изменений `SqlExpression` и `null` в поле, которое допускает `NULL`. При ошибке типа выбрасывает `Bitrix\Main\ArgumentException` с именем поля |
| `getFetchDataModifiers` | Если перевод в часовой пояс отключен, добавляет модификатор [disableTimezoneFetchModifier](disable-timezone-fetch-modifier.md) |
| `getGetterTypeHint`, `getSetterTypeHint` | Возвращают тип `\Bitrix\Main\Type\DateTime` с учетом того, допускает ли поле `NULL` |

### Унаследованные методы

Метод `configureFormat` работает как в классе `DateField`. Значение поля проверяет валидатор `DateValidator`, его поле получает от `DateField`.

Методы `configureRequired`, `configureNullable`, `configureDefaultValue` и другие работают как в классе `ScalarField`.

## Смотрите также

- [ORM: основные операции](../../../../../orm/entity-operations.md)
