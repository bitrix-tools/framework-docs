---
title: Получить настройки пресета Options::getFilterSettings
description: Метод Options::getFilterSettings возвращает настройки одного пресета — название, значения полей и порядок полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getFilterSettings` возвращает настройки одного пресета.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getFilterSettings($presetId)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив настроек пресета или `null`, если пресета нет.

| Ключ | Значение |
| --- | --- |
| `name` | Название |
| `fields` | Значения полей — массив `ключ => значение` |
| `filter_rows` | Поля пресета через запятую |
| `sort` | Порядок в списке пресетов |
| `for_all` | `true`, если пресет доступен всем пользователям |

## Примеры

**Пример.** Код читает значения полей пресета:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', [
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
]);

echo json_encode($options->getFilterSettings('heavy')['fields']);
```

Код выведет `{"WEIGHT_numsel":"more","WEIGHT_from":"10"}`.

## Смотрите также

- [Options::setFilterSettings](set-filter-settings.md)
