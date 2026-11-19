---
title: Сбросить текущий фильтр Options::reset
description: Метод Options::reset очищает данные фильтра в локальном хранилище сессии — текущий пресет, строку поиска и дополнительные поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::reset` очищает данные фильтра в локальном хранилище сессии — текущий пресет, строку поиска и дополнительные поля. После сброса закрепленный пресет станет текущим.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function reset()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод не меняет сохраненные пресеты. Чтобы удалить их, используйте [destroy](destroy.md).
- У гостя в локальном хранилище сессии лежат и сохраненные настройки, поэтому метод удаляет и их.

## Примеры

**Пример.** Код применяет пресет со строкой поиска и сбрасывает фильтр:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter', ['active' => ['name' => 'Active', 'default' => true, 'fields' => ['ACTIVE' => 'Y']]]);
$options->setFilterSettings('tmp_filter', ['fields' => ['NAME' => 'kg', 'FIND' => 'steel']], true, false);
$before = $options->getCurrentFilterId() . ' ' . $options->getSearchString();
$options->reset();

echo $before . ' / ' . $options->getCurrentFilterId() . ' ' . var_export($options->getSearchString(), true);
```

Код выведет `tmp_filter steel / active ''`.

## Смотрите также

- [Options::destroy](destroy.md)
- [Options::restore](restore.md)
