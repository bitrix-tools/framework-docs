---
title: Получить формат даты в виде маски PHP Date::getFormat
description: Метод Date::getFormat возвращает формат даты из региональных настроек, переведенный в маску PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `Date::getFormat` возвращает формат даты из региональных настроек в виде маски PHP. Конструктор и метод [toString](to-string.md) используют этот формат по умолчанию.

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public static function getFormat(?Context\Culture $culture = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| culture | `?Bitrix\Main\Context\Culture` | Задает региональные настройки. Если передать `null`, метод берет региональные настройки текущего сайта. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает маску PHP, например `d.m.Y`. Метод переводит формат методом [convertFormatToPhp](convert-format-to-php.md).

Вызов `Date::getFormat` возвращает формат даты. Вызов `DateTime::getFormat` возвращает формат даты и времени, например `d.m.Y H:i:s`.

## Особенности

- Метод запоминает региональные настройки текущего сайта при первом вызове без аргумента и использует их до конца запроса. Если контекста на момент вызова нет, метод ничего не запоминает и пробует снова при следующем вызове.
- Если региональных настроек нет ни в аргументе, ни в контексте, метод берет формат `DD.MM.YYYY`, а у `DateTime` — `DD.MM.YYYY HH:MI:SS`.

## Примеры

**Пример.** Код выводит маски даты и даты со временем для текущего сайта:

```php
<?php
use Bitrix\Main\Type\Date;
use Bitrix\Main\Type\DateTime;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Date::getFormat() . ' | ' . DateTime::getFormat();
```

При формате даты `DD.MM.YYYY` и формате даты и времени `DD.MM.YYYY HH:MI:SS` в региональных настройках код выведет `d.m.Y | d.m.Y H:i:s`.

## Смотрите также

- [Date::convertFormatToPhp](convert-format-to-php.md)
- [Date::toString](to-string.md)
