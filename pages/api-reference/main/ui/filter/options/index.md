---
title: Options — настройки и значения фильтра main.ui.filter
description: Класс Bitrix\Main\UI\Filter\Options читает выбранный пользователем фильтр компонента main.ui.filter, хранит пресеты и сохраняет настройки фильтра.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\UI\Filter`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.10

{% endnote %}

## Когда использовать

Класс `Options` работает с настройками фильтра компонента `main.ui.filter`. Серверный код страницы создает объект с тем же идентификатором фильтра, что и компонент, и получает значения, которые пользователь выбрал в интерфейсе.

```php
use Bitrix\Main\UI\Filter\Options;

$filterOptions = new Options('units_filter', $presets);
$filter = $filterOptions->getFilter($fields);
```

Фильтр хранит пресеты — наборы полей со значениями. Один пресет текущий, его значения возвращает [getFilter](get-filter.md). Встроенный пресет `default_filter` означает пустой фильтр, `tmp_filter` — значения, которые пользователь ввел без сохранения пресета.

Класс хранит настройки по-разному.

| Что | Где |
| --- | --- |
| Пресеты, закрепленный пресет, порядок полей | Настройки пользователя категории `main.ui.filter`. Для гостя — локальное хранилище сессии `main.ui.filter` |
| Текущий пресет, строка поиска, дополнительные поля | Локальное хранилище сессии `main.ui.filter` |
| Настройки для всех пользователей | Общие настройки категории `main.ui.filter.common` |
| Общие пресеты нескольких фильтров | Настройки пользователя категории `main.ui.filter.presets` |

Подробнее — в статье [Фильтр main.ui.filter](../../../../../ui/main-ui-filter.md).

## Методы класса

### Объект и сохранение

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает объект и читает настройки фильтра | |
| [hasOptions](has-options.md) | Проверяет, есть ли у пользователя сохраненные настройки фильтра | |
| [getId](get-id.md) | Возвращает идентификатор фильтра | |
| [getOptions](get-options.md) | Возвращает все настройки фильтра | |
| [fetchOptions](fetch-options.md) | Читает сохраненные настройки фильтра | |
| [save](save.md) | Сохраняет настройки | |
| [reset](reset.md) | Сбрасывает текущий пресет и строку поиска | |
| [destroy](destroy.md) | Удаляет сохраненные настройки фильтра | |

### Пресеты

| Метод | Описание | С версии |
| --- | --- | --- |
| [getPresets](get-presets.md) | Возвращает пресеты | |
| [setPresets](set-presets.md) | Заменяет пресеты | |
| [getDefaultPresets](get-default-presets.md) | Возвращает пресеты из параметров компонента | |
| [setDefaultPresets](set-default-presets.md) | Заменяет пресеты из параметров компонента | |
| [findDefaultPresetId](find-default-preset-id.md) | Находит пресет с ключом `default` | |
| [getFilterSettings](get-filter-settings.md) | Возвращает настройки пресета | |
| [setFilterSettings](set-filter-settings.md) | Задает настройки пресета | |
| [setFilterSettingsArray](set-filter-settings-array.md) | Задает настройки нескольких пресетов | |
| [deleteFilter](delete-filter.md) | Удаляет пресет | |
| [isDeletedPreset](is-deleted-preset.md) | Проверяет, удален ли пресет | |
| [setDeletedPresets](set-deleted-presets.md) | Заменяет список удаленных пресетов | |
| [restore](restore.md) | Восстанавливает пресеты по умолчанию | |
| [setFilterRows](set-filter-rows.md) | Задает поля пресета | |
| [removeRowFromPreset](remove-row-from-preset.md) | Убирает поле из пресета | |
| [getAdditionalPresetFields](get-additional-preset-fields.md) | Возвращает дополнительные поля пресета | |
| [setAdditionalPresetFields](set-additional-preset-fields.md) | Задает дополнительные поля пресета | |
| [getUsedFields](get-used-fields.md) | Возвращает поля всех пресетов | |
| [fetchPresetFields](fetch-preset-fields.md) | Возвращает поля одного пресета | |
| [getRowsFromFields](get-rows-from-fields.md) | Получает коды полей из ключей значений | |

### Текущий и закрепленный пресет

| Метод | Описание | С версии |
| --- | --- | --- |
| [getCurrentFilterId](get-current-filter-id.md) | Возвращает текущий пресет | |
| [getDefaultFilterId](get-default-filter-id.md) | Возвращает закрепленный пресет | |
| [getSessionFilterId](get-session-filter-id.md) | Возвращает пресет, который пользователь применил | |
| [setCurrentPreset](set-current-preset.md) | Задает ключ `filter` в настройках | |
| [setDefaultPreset](set-default-preset.md) | Задает закрепленный пресет | |
| [pinPreset](pin-preset.md) | Закрепляет пресет | |
| [isPinned](is-pinned.md) | Проверяет, закреплен ли пресет | |
| [isUsePinPreset](is-use-pin-preset.md) | Проверяет, применяется ли закрепленный пресет | |
| [setUsePinPreset](set-use-pin-preset.md) | Включает применение закрепленного пресета | |
| [getCurrentFilterPresetId](get-current-filter-preset-id.md) | Возвращает пресет, который задал код | |
| [setCurrentFilterPresetId](set-current-filter-preset-id.md) | Задает текущий пресет из кода | |
| [isDefaultFilter](is-default-filter.md) | Проверяет, равен ли код пресета `default_filter` | |
| [isSetOutside](is-set-outside.md) | Проверяет, применили ли фильтр снаружи компонента | |
| [setupDefaultFilter](setup-default-filter.md) | Применяет значения как временный фильтр | |

### Значения фильтра

| Метод | Описание | С версии |
| --- | --- | --- |
| [getFilter](get-filter.md) | Возвращает значения текущего пресета | |
| [getFilterLogic](get-filter-logic.md) | Возвращает условия для выборки | |
| [getSearchString](get-search-string.md) | Возвращает строку поиска | |
| [fetchFieldValuesFromFilterSettings](fetch-field-values-from-filter-settings.md) | Получает значения полей из настроек пресета | |
| [isDateField](is-date-field.md) | Проверяет ключ поля даты | |
| [fetchDateFieldValue](fetch-date-field-value.md) | Вычисляет границы поля даты | |
| [calcDates](calc-dates.md) | Вычисляет границы периода | |
| [isNumberField](is-number-field.md) | Проверяет ключ числового поля | |
| [fetchNumberFieldValue](fetch-number-field-value.md) | Получает значения числового поля | |
| [isSetFromRequest](is-set-from-request.md) | Проверяет, передан ли фильтр в адресе | |
| [fetchSettingsFromQuery](fetch-settings-from-query.md) | Получает значения полей из адреса | |

### Общие пресеты и настройки для всех

| Метод | Описание | С версии |
| --- | --- | --- |
| [isUseCommonPresets](is-use-common-presets.md) | Проверяет, использует ли фильтр общие пресеты | |
| [getCommonPresetsId](get-common-presets-id.md) | Возвращает идентификатор общих пресетов | |
| [fetchCommonPresets](fetch-common-presets.md) | Читает общие пресеты | |
| [saveForAll](save-for-all.md) | Сохраняет настройки для всех пользователей, если хватает прав | |
| [saveCommon](save-common.md) | Сохраняет настройки для всех пользователей | |
| [saveOptionsForUser](save-options-for-user.md) | Сохраняет настройки для другого пользователя | |
| [getAllUserOptions](get-all-user-options.md) | Возвращает настройки фильтра всех пользователей | |
| [isCommon](is-common.md) | Проверяет, общие ли настройки | |
| [isCurrentUserEditOtherSettings](is-current-user-edit-other-settings.md) | Проверяет право менять чужие настройки | |

## Константы

| Константа | Значение | Описание |
| --- | --- | --- |
| `DEFAULT_FILTER` | `'default_filter'` | Пустой пресет. С ним [getFilter](get-filter.md) возвращает пустой массив |
| `TMP_FILTER` | `'tmp_filter'` | Пресет со значениями, которые пользователь ввел без сохранения |

## Смотрите также

- [Фильтр main.ui.filter](../../../../../ui/main-ui-filter.md)
- [Grid\Options](../../../grid/options/index.md)
