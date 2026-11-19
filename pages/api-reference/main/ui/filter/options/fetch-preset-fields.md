---
title: Получить поля пресета Options::fetchPresetFields
description: Статический метод Options::fetchPresetFields возвращает коды полей одного пресета из filter_rows или из ключей значений.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchPresetFields` возвращает коды полей одного пресета.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchPresetFields($preset)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| preset\* | `array` | Задает настройки пресета |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив кодов полей без повторов.

- Если у пресета есть строка `filter_rows`, метод делит ее по запятым.
- Иначе метод получает коды из ключей `fields` методом [getRowsFromFields](get-rows-from-fields.md).

## Примеры

**Пример.** Код получает поля из списка полей и из значений:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo implode(',', Options::fetchPresetFields(['filter_rows' => 'NAME,ACTIVE,NAME'])) . ' / '
    . implode(',', Options::fetchPresetFields(['fields' => ['WEIGHT_from' => '10', 'NAME' => 'kg']]));
```

Код выведет `NAME,ACTIVE / WEIGHT,NAME`.

## Смотрите также

- [Options::getRowsFromFields](get-rows-from-fields.md)
- [Options::getUsedFields](get-used-fields.md)
