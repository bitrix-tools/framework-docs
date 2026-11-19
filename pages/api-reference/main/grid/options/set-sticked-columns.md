---
title: Задать закрепленные колонки Options::setStickedColumns
description: Метод Grid\Options::setStickedColumns задает колонки, которые остаются на месте при горизонтальной прокрутке грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setStickedColumns` задает закрепленные колонки — колонки, которые остаются на месте при горизонтальной прокрутке грида. Чтобы сохранить значение, вызовите [save](save.md).

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setStickedColumns($columns = [])
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| columns | `array` | Задает идентификаторы колонок. Если значение не массив, метод записывает пустой массив. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод записывает колонки в представление `default`, а [getStickedColumns](get-sticked-columns.md) читает текущее представление. Если текущее представление другое, `getStickedColumns` не вернет записанные колонки.

## Примеры

**Пример.** Код закрепляет колонку `ID` и читает закрепленные колонки:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setStickedColumns(['ID']);

echo implode(',', $options->getStickedColumns() ?? []);
```

Если текущее представление — `default`, код выведет `ID`.

## Смотрите также

- [Options::getStickedColumns](get-sticked-columns.md)
