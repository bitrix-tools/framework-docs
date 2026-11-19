---
title: Получить фразу во множественном числе Loc::getMessagePlural
description: Метод Loc::getMessagePlural возвращает фразу в форме множественного числа, которая подходит к числу и языку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Loc::getMessagePlural` возвращает фразу в форме, которая согласуется с числом, например «5 знаков» или «2 знака». Метод выбирает форму методом [getPluralForm](get-plural-form.md).

Языковой файл хранит формы фразы под кодами с окончанием `_PLURAL_<номер формы>`, например `UNIT_COUNT_PLURAL_0`, `UNIT_COUNT_PLURAL_1`, `UNIT_COUNT_PLURAL_2`.

Сигнатура метода в классе `Bitrix\Main\Localization\Loc`:

```php
public static function getMessagePlural(string $code, int $value, ?array $replace = null, ?string $language = null): ?string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` | Задает код фразы без окончания `_PLURAL_<номер>` |
| value\* | `int` | Задает число, к которому нужна форма |
| replace | `array`, `null` | Задает замены в тексте фразы, например `['#NUM#' => 5]`. Метод не подставляет число в текст, передайте его в `replace`. По умолчанию — `null` |
| language | `string`, `null` | Задает код языка. По умолчанию — `null`, текущий язык |

## Возвращаемое значение

Метод возвращает строку или `null`. Если фразы для вычисленной формы нет, метод возвращает фразу с окончанием `_PLURAL_1`. Если нет и ее, метод возвращает `null`.

## Примеры

**Пример.** Код выводит фразу для чисел 1, 2 и 5 на русском языке:

```php
<?php
use Bitrix\Main\Localization\Loc;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Loc::loadMessages($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/lib/Validation/Validator/LengthValidator.php');

foreach ([1, 2, 5] as $min)
{
    echo Loc::getMessagePlural('MAIN_VALIDATION_LENGTH_INVALID_MIN', $min, ['#MIN#' => $min], 'ru') . PHP_EOL;
}
```

Код выведет фразы со словами «знак», «знака» и «знаков».

## Смотрите также

- [Loc::getPluralForm](get-plural-form.md)
- [Loc::getMessage](get-message.md)
