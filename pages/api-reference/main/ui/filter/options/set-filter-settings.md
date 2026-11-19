---
title: Задать настройки пресета Options::setFilterSettings
description: Метод Options::setFilterSettings задает настройки пресета — название, значения полей, порядок полей — и может сделать пресет текущим.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setFilterSettings` задает настройки пресета. Если пресета нет, метод создает его. Компонент `main.ui.filter` вызывает метод, когда пользователь применяет фильтр или сохраняет пресет.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function setFilterSettings($presetId, $settings, $currentPreset = true, $useRequest = true)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| presetId\* | `string` | Задает код пресета |
| settings\* | `array` | Задает настройки, ключи перечислены в таблице ниже |
| currentPreset | `bool` | Значение `true` разрешает сделать пресет текущим. По умолчанию — `true` |
| useRequest | `bool` | Значение `true` делает пресет текущим, только если запрос содержит `apply_filter=Y` или `clear_filter=Y` в адресе или в POST-параметре `params`. С `with_preset=Y` пресет станет текущим, только если текущий пресет — `default_filter`. Значение `false` делает пресет текущим без проверки запроса. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

| Ключ `settings` | Значение |
| --- | --- |
| `name` | Название пресета |
| `fields` | Значения полей. Ключ `FIND` метод переносит в строку поиска |
| `additional` | Дополнительные поля, которые хранятся в локальном хранилище сессии |
| `rows` | Поля пресета — массив или строка через запятую |
| `sort` | Порядок в списке |
| `for_all` | Строка `'true'` открывает пресет всем пользователям |
| `clear_filter` | Значение `'Y'` без `fields` очищает значения полей |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Для пресета `default_filter` метод очищает значения полей, если `settings` содержит массив `fields`.
- Метод меняет только объект и локальное хранилище сессии. Чтобы сохранить пресет, вызовите [save](save.md).

## Примеры

**Пример.** Код задает значения временного пресета, делает его текущим и читает фильтр:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setFilterSettings('tmp_filter', ['fields' => ['NAME' => 'kg', 'FIND' => 'steel'], 'rows' => ['NAME']], true, false);

$filter = $options->getFilter([['id' => 'NAME']]);

echo $filter['NAME'] . ' ' . $filter['FIND'] . ' ' . $filter['PRESET_ID'];
```

Код выведет `kg steel tmp_filter`.

## Смотрите также

- [Options::getFilterSettings](get-filter-settings.md)
- [Options::setFilterSettingsArray](set-filter-settings-array.md)
