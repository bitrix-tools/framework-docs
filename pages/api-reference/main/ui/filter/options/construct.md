---
title: Создать объект настроек фильтра Options::__construct
description: Конструктор Options::__construct создает объект настроек фильтра main.ui.filter и читает сохраненные настройки пользователя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Options::__construct` создает объект настроек фильтра и читает сохраненные настройки пользователя. Передайте те же идентификатор и пресеты, что и компоненту `main.ui.filter` в параметрах `FILTER_ID` и `FILTER_PRESETS`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function __construct($filterId, $filterPresets = [], $commonPresetsId = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| filterId\* | `string` | Задает идентификатор фильтра |
| filterPresets | `array` | Задает пресеты по умолчанию — массив `код => настройки`. Настройки содержат ключи `name`, `fields` и `default`. По умолчанию — пустой массив |
| commonPresetsId | `string` или `null` | Задает идентификатор общих пресетов, если несколько фильтров делят пресеты. По умолчанию — `null` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentNullException` | Идентификатор фильтра пустой |

## Особенности

- Если сохраненных пресетов нет, объект берет пресеты из `filterPresets`.
- Закрепленным становится пресет с ключом `default` = `true`. Если такого нет — пустой пресет `default_filter`.
- Если задан `commonPresetsId`, объект читает пресеты и список удаленных пресетов из общих пресетов.

## Примеры

**Пример.** Код создает объект с двумя пресетами и читает закрепленный:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$presets = [
    'active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']],
    'heavy' => ['name' => 'Heavy', 'fields' => ['WEIGHT_numsel' => 'more', 'WEIGHT_from' => '10']],
];
$options = new Options('units_filter', $presets);

echo $options->getDefaultFilterId();
```

Код выведет `active`.

## Смотрите также

- [Фильтр main.ui.filter](../../../../../ui/main-ui-filter.md)
- [Options::getFilter](get-filter.md)
