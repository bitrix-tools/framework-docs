---
title: Задать региональные настройки Context::setCulture
description: Метод Context::setCulture задает региональные настройки контекста объектом Culture.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Context::setCulture` задает региональные настройки контекста и возвращает тот же контекст. Ядро вызывает метод в начале запроса по настройкам сайта или языка.

Сигнатура метода в классе `Bitrix\Main\Context`:

```php
public function setCulture(Context\Culture $culture)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| culture\* | `Bitrix\Main\Context\Culture` | Задает региональные настройки. Такой объект возвращает метод `fetchObject` у результата `CultureTable::getList` |

## Возвращаемое значение

Метод возвращает текущий контекст.

## Особенности

- Метод меняет только контекст и не меняет константы `FORMAT_DATE` и `FORMAT_DATETIME`.
- Метод [Date::getFormat](../type/date/get-format.md) запоминает объект региональных настроек контекста при первом вызове без аргумента. Если формат уже запросили, новые настройки контекста на `Date` и `DateTime` не влияют. Чтобы вывести дату в других настройках, передайте объект в `toString` или `getFormat` аргументом.

## Примеры

**Пример.** Код временно задает контексту региональные настройки с кодом `en`, выводит их формат даты и восстанавливает прежние настройки:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\Localization\CultureTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$context = Context::getCurrent();
$previousCulture = $context->getCulture();
$culture = CultureTable::getList(['filter' => ['=CODE' => 'en']])->fetchObject();

if ($culture !== null && $previousCulture !== null)
{
    try
    {
        $context->setCulture($culture);
        echo $context->getCulture()->getDateFormat();
    }
    finally
    {
        $context->setCulture($previousCulture);
    }
}
```

При формате `MM/DD/YYYY` у настроек `en` код выведет `MM/DD/YYYY`.

**Пример.** Код выводит дату в формате настроек `en`, переданных аргументом, независимо от настроек контекста:

```php
<?php
use Bitrix\Main\Localization\CultureTable;
use Bitrix\Main\Type\Date;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$culture = CultureTable::getList(['filter' => ['=CODE' => 'en']])->fetchObject();

if ($culture !== null)
{
    echo (new Date('2026-01-15', 'Y-m-d'))->toString($culture);
}
```

Код выведет `01/15/2026`.

## Смотрите также

- [Context::getCulture](get-culture.md)
- [Date::toString](../type/date/to-string.md)
