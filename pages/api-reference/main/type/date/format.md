---
title: Вывести дату по маске Date::format
description: Метод Date::format возвращает дату строкой по маске PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.18

{% endnote %}

Метод `Date::format` возвращает дату строкой по маске PHP. Метод передает маску в метод `format` стандартного класса `\DateTime` и не учитывает региональные настройки. Чтобы вывести дату в формате региональных настроек, используйте [toString](to-string.md).

Сигнатура метода в классе `Bitrix\Main\Type\Date`:

```php
public function format($format)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| format\* | `string` | Задает маску PHP, например `'d.m.Y'` или `'Y-m-d H:i:s'` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку. У объекта `DateTime` метод выводит время в часовом поясе объекта и не переводит его во время пользователя.

## Примеры

**Пример.** Код выводит одну дату по двум маскам:

```php
<?php
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$date = new Date('2026-01-15', 'Y-m-d');

echo $date->format('d.m.Y') . ' ' . $date->format('Y-m-d');
```

Код выведет `15.01.2026 2026-01-15`.

## Смотрите также

- [Date::toString](to-string.md)
- [Date::getFormat](get-format.md)
