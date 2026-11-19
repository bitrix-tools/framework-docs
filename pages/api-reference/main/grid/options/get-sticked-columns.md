---
title: Получить закрепленные колонки Options::getStickedColumns
description: Метод Grid\Options::getStickedColumns возвращает закрепленные колонки текущего представления грида или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getStickedColumns` возвращает закрепленные колонки текущего представления грида.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getStickedColumns()
```

## Возвращаемое значение

Метод возвращает массив идентификаторов колонок или `null`, если в текущем представлении закрепленных колонок нет.

## Особенности

Метод [setStickedColumns](set-sticked-columns.md) записывает колонки в представление `default`. Если текущее представление другое, метод не вернет эти колонки.

## Примеры

**Пример.** Код проверяет, закреплены ли колонки:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$columns = (new Options('units_grid'))->getStickedColumns();

echo $columns === null ? 'no sticked columns' : implode(',', $columns);
```

Для грида без сохраненных настроек код выведет `no sticked columns`.

## Смотрите также

- [Options::setStickedColumns](set-sticked-columns.md)
