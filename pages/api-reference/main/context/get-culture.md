---
title: Получить региональные настройки Context::getCulture
description: Метод Context::getCulture возвращает региональные настройки текущего запроса — форматы даты, времени, имени и кодировку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::getCulture` возвращает региональные настройки текущего запроса. Классы [Date](../type/date/index.md) и [DateTime](../type/date-time/index.md) берут из них формат даты по умолчанию.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function getCulture()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Context\Culture` или `null`, если региональные настройки не заданы.

Основные методы объекта:

- `getDateFormat` — формат даты, например `DD.MM.YYYY`,
- `getDateTimeFormat` — формат даты и времени, например `DD.MM.YYYY HH:MI:SS`,
- `getNameFormat` — формат имени пользователя,
- `getCharset` — кодировка,
- `getCode` — код региональных настроек, например `ru`.

Ядро задает константы `FORMAT_DATE`, `FORMAT_DATETIME` и `SITE_CHARSET` классического API из этого объекта.

## Примеры

**Пример.** Код выводит форматы даты и даты со временем:

```php
<?php
use Bitrix\Main\Context;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$culture = Context::getCurrent()->getCulture();

if ($culture !== null)
{
    echo $culture->getDateFormat() . ' | ' . $culture->getDateTimeFormat();
}
```

Для русских региональных настроек код выведет `DD.MM.YYYY | DD.MM.YYYY HH:MI:SS`.

## Смотрите также

- [Context::setCulture](set-culture.md)
- [Date::getFormat](../type/date/get-format.md)
