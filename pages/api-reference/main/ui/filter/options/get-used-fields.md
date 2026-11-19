---
title: Получить поля всех пресетов Options::getUsedFields
description: Метод Options::getUsedFields возвращает коды полей, которые используют пресеты пользователя и пресеты по умолчанию.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getUsedFields` возвращает коды полей, которые используют все пресеты — пользовательские и по умолчанию. Метод нужен, например, чтобы выбрать из базы только поля, которые нужны фильтру.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getUsedFields()
```

## Возвращаемое значение

Метод возвращает массив кодов полей без повторов. Ключи массива идут с пропусками.

## Особенности

- Метод берет поля пресета из `filter_rows`. Если этого ключа нет, метод получает коды из ключей `fields` методом [fetchPresetFields](fetch-preset-fields.md).
- Если у пресета по умолчанию есть ключ `default`, его поля идут первыми.

## Примеры

**Пример.** Код получает поля двух пресетов:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);

echo implode(',', $options->getUsedFields());
```

Код выведет `ACTIVE,WEIGHT`.

## Смотрите также

- [Options::fetchPresetFields](fetch-preset-fields.md)
