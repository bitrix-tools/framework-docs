---
title: Сбросить раскрытые строки Options::resetExpandedRows
description: Метод Grid\Options::resetExpandedRows записывает в сессию пустой список раскрытых строк грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::resetExpandedRows` сбрасывает раскрытые строки грида. Метод вызывает [setExpandedRows](set-expanded-rows.md) с пустым массивом.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function resetExpandedRows()
```

## Возвращаемое значение

Метод ничего не возвращает. После вызова метод [getExpandedRows](get-expanded-rows.md) возвращает пустой массив, а не `null`.

## Примеры

**Пример.** Код запоминает раскрытые строки и сбрасывает их:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setExpandedRows([1, 2]);
$options->resetExpandedRows();

echo count($options->getExpandedRows());
```

Код выведет `0`.

## Смотрите также

- [Options::setExpandedRows](set-expanded-rows.md)
