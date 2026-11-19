---
title: Удалить настройки фильтра Options::destroy
description: Метод Options::destroy удаляет сохраненные настройки фильтра текущего пользователя и данные в локальном хранилище сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::destroy` удаляет сохраненные настройки фильтра текущего пользователя — категории `main.ui.filter` и `main.ui.filter.presets` с идентификатором фильтра. Метод также очищает данные фильтра в локальном хранилище сессии.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function destroy()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Объект после вызова хранит прежние настройки в памяти. Чтобы работать дальше, создайте новый объект.
- Метод не удаляет общие настройки.
- Метод ищет общие пресеты по идентификатору фильтра, а не по `commonPresetsId`.

## Примеры

**Пример.** Код сохраняет настройки, удаляет их и проверяет:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'fields' => ['ACTIVE' => 'Y']]]);
$options->pinPreset('active');
$options->save();
$options->destroy();

echo (new Options('units_filter'))->getDefaultFilterId();
```

Код выведет `default_filter`.

## Смотрите также

- [Options::reset](reset.md)
- [Options::save](save.md)
