---
title: Получить раскрытые строки Options::getExpandedRows
description: Метод Grid\Options::getExpandedRows возвращает из сессии идентификаторы раскрытых строк грида или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getExpandedRows` возвращает идентификаторы раскрытых строк грида, которые запомнил [setExpandedRows](set-expanded-rows.md). Метод читает сессию.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getExpandedRows()
```

## Возвращаемое значение

Метод возвращает массив идентификаторов или `null`, если в текущей сессии метод `setExpandedRows` не вызывали. После [resetExpandedRows](reset-expanded-rows.md) метод возвращает пустой массив.

## Примеры

**Пример.** Код проверяет, есть ли раскрытые строки:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = (new Options('units_grid'))->getExpandedRows();

echo empty($rows) ? 'no expanded rows' : implode(',', $rows);
```

В новой сессии код выведет `no expanded rows`.

## Смотрите также

- [Options::setExpandedRows](set-expanded-rows.md)
