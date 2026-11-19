---
title: Получить дополнительные поля пресета Options::getAdditionalPresetFields
description: Метод Options::getAdditionalPresetFields возвращает дополнительные поля пресета из локального хранилища сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getAdditionalPresetFields` возвращает дополнительные поля пресета. Дополнительные поля — значения, которые пользователь добавил к пресету на время сессии и не сохранил в пресете. Класс хранит их в локальном хранилище сессии, а [getFilter](get-filter.md) добавляет их к значениям пресета.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getAdditionalPresetFields($presetId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив `ключ поля => значение`. Если полей нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код задает дополнительное поле и читает его:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setAdditionalPresetFields('heavy', ['COLOR' => 'red']);

echo json_encode($options->getAdditionalPresetFields('heavy'));
```

Код выведет `{"COLOR":"red"}`.

## Смотрите также

- [Options::setAdditionalPresetFields](set-additional-preset-fields.md)
