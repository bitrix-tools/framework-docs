---
title: Вывести дату в формате региональных настроек Date::toString
description: Метод Date::toString возвращает дату строкой в формате даты из региональных настроек текущего сайта или переданного объекта Culture.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `Date::toString` возвращает дату строкой в формате из региональных настроек. Метод берет формат методом [getFormat](get-format.md) и выводит дату методом [format](format.md).

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public function toString(?Context\Culture $culture = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| culture | `?Bitrix\Main\Context\Culture` | Задает региональные настройки, из которых метод берет формат. Если передать `null`, метод берет региональные настройки текущего сайта. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает строку. Если региональных настроек нет ни в аргументе, ни в контексте, метод выводит дату в формате `DD.MM.YYYY`.

Приведение объекта к строке, например `echo $date`, вызывает `toString` без аргументов.

Класс `DateTime` переопределяет метод. Его метод выводит дату со временем и может переводить время в часовой пояс пользователя. Подробнее — на странице [DateTime](../date-time/index.md#наследование).

## Примеры

**Пример.** Код выводит дату в формате текущего сайта и в формате региональных настроек с кодом `en`:

```php
<?php
use Bitrix\Main\Localization\CultureTable;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = new Date('2026-01-15', 'Y-m-d');
$culture = CultureTable::getList(['filter' => ['=CODE' => 'en']])->fetchObject();

echo $date->toString() . ' ' . $date->toString($culture);
```

При формате `DD.MM.YYYY` у текущего сайта и `MM/DD/YYYY` у настроек `en` код выведет `15.01.2026 01/15/2026`.

## Смотрите также

- [Date::format](format.md)
- [Date::getFormat](get-format.md)
