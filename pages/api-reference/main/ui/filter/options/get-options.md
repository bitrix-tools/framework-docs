---
title: Получить все настройки фильтра Options::getOptions
description: Метод Options::getOptions возвращает массив всех настроек фильтра — пресеты, закрепленный пресет и служебные ключи.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getOptions` возвращает все настройки фильтра. Метод [save](save.md) сохраняет именно этот массив.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getOptions()
```

## Возвращаемое значение

Метод возвращает массив настроек.

| Ключ | Значение |
| --- | --- |
| `filters` | Пресеты пользователя — массив `код => настройки` |
| `default_presets` | Пресеты из параметров компонента |
| `deleted_presets` | Удаленные пресеты — массив `код => true` |
| `default` | Код закрепленного пресета |
| `filter` | Код пресета из настроек. Текущий пресет лежит в локальном хранилище сессии |
| `use_pin_preset` | Применять ли закрепленный пресет |
| `filter_rows` | Поля фильтра без пресета, если их задали |

## Примеры

**Пример.** Код выводит ключи настроек:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);

echo implode(',', array_keys($options->getOptions()));
```

Код выведет `use_pin_preset,deleted_presets,default_presets,default,filter,filters`.

## Смотрите также

- [Options::save](save.md)
