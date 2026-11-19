---
title: Убрать поле из пресета Options::removeRowFromPreset
description: Метод Options::removeRowFromPreset убирает поле из списка полей пресета.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::removeRowFromPreset` убирает поле из списка полей пресета. Метод нужен, например, когда модуль удалил поле и пресеты пользователей больше не должны его показывать.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function removeRowFromPreset(string $presetId, string $rowName): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |
| rowName\* | `string` | Задает код поля |

## Возвращаемое значение

Метод возвращает `true`, если убрал поле. Если поля нет в списке или у пресета нет списка полей, метод возвращает `false`.

## Особенности

- Метод меняет только список полей `filter_rows`. Значения поля в `fields` остаются.
- Чтобы сохранить изменение, вызовите [save](save.md).

## Примеры

**Пример.** Код убирает поле и пробует убрать несуществующее:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['heavy' => ['name' => 'Heavy', 'fields' => [], 'filter_rows' => 'WEIGHT,NAME']]);

var_dump($options->removeRowFromPreset('heavy', 'NAME'), $options->removeRowFromPreset('heavy', 'CODE'));
echo $options->getFilterSettings('heavy')['filter_rows'];
```

Код выведет:

```text
bool(true)
bool(false)
WEIGHT
```

## Смотрите также

- [Options::setFilterRows](set-filter-rows.md)
