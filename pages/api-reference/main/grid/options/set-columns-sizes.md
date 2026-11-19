---
title: Задать ширину колонок Options::setColumnsSizes
description: Метод Grid\Options::setColumnsSizes задает ширину колонок текущего представления грида в пикселях.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setColumnsSizes` задает ширину колонок текущего представления грида. Чтобы сохранить значение, вызовите [save](save.md).

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setColumnsSizes($expand, $sizes, array $resizedColumns = [])
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expand\* | `float` | Задает коэффициент растяжения грида. Для нескалярного значения метод записывает `1` |
| sizes\* | `array` | Задает ширину колонок. Ключ — идентификатор колонки, значение — ширина в пикселях |
| resizedColumns | `array` | Задает колонки, ширину которых пользователь изменил вручную. По умолчанию — пустой массив |

Типы `expand` и `sizes` в таблице описывают назначение аргументов. Сигнатура PHP объявляет только тип `resizedColumns`.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод заменяет все сохраненные размеры текущего представления. Метод не сохраняет колонки с шириной `0` и меньше и убирает пробелы по краям идентификаторов колонок.
- Параметр `resizedColumns` есть в версиях новее `main` 26.150.0. Метод добавляет колонки из параметра к уже сохраненным и оставляет только колонки с шириной. Метод [getResizedColumns](get-resized-columns.md) возвращает список.
- Компонент `main.ui.grid` вызывает метод, когда пользователь меняет ширину колонки.

## Примеры

**Пример.** Код задает ширину двух колонок и читает сохраненные размеры:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setColumnsSizes(1, ['NAME' => 200, 'CODE' => 0]);

echo json_encode($options->getCurrentOptions()['columns_sizes']['columns']);
```

Код выведет `{"NAME":200}`.

## Смотрите также

- [Options::getResizedColumns](get-resized-columns.md)
- [Options::save](save.md)
