---
title: Задать дополнительные поля пресета Options::setAdditionalPresetFields
description: Метод Options::setAdditionalPresetFields задает дополнительные поля пресета в локальном хранилище сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setAdditionalPresetFields` задает дополнительные поля пресета в локальном хранилище сессии. [getFilter](get-filter.md) добавляет их к значениям пресета.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setAdditionalPresetFields($presetId, $additional = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |
| additional | `array` | Задает поля — массив `ключ поля => значение`. По умолчанию — пустой массив, он очищает поля |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод [save](save.md) не сохраняет дополнительные поля в настройках пользователя. Они хранятся до конца сессии.

## Примеры

**Пример.** Код добавляет поле к текущему пресету и читает фильтр:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']]]);
$options->setAdditionalPresetFields('active', ['COLOR' => 'red']);
$filter = $options->getFilter();

echo $filter['ACTIVE'] . ' ' . $filter['COLOR'];
```

Код выведет `Y red`.

## Смотрите также

- [Options::getAdditionalPresetFields](get-additional-preset-fields.md)
