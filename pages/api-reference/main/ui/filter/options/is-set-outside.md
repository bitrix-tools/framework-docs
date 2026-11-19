---
title: Проверить применение снаружи Options::isSetOutside
description: Метод Options::isSetOutside проверяет, применили ли фильтр снаружи компонента, например из JavaScript другого блока страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::isSetOutside` проверяет признак `isSetOutside` в локальном хранилище сессии. Компонент `main.ui.filter` ставит признак, когда фильтр применяет внешний код, например кнопка или счетчик в другом блоке страницы. Признак передает параметр запроса `params[isSetOutside]`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function isSetOutside(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если признак включен, иначе `false`.

## Примеры

**Пример.** Код проверяет признак после применения пресета из кода:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setFilterSettings('tmp_filter', ['fields' => ['NAME' => 'kg']], true, false);

var_dump($options->isSetOutside());
```

Код выведет `bool(false)`, потому что запрос не передал признак.

## Смотрите также

- [Options::setFilterSettings](set-filter-settings.md)
