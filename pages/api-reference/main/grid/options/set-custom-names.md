---
title: Задать свои названия колонок Options::setCustomNames
description: Метод Grid\Options::setCustomNames задает свои названия колонок вместо стандартных в представлении default.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setCustomNames` задает свои названия колонок, которые пользователь ввел вместо стандартных. Чтобы сохранить значение, вызовите [save](save.md).

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setCustomNames($names)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| names\* | `array` | Задает названия. Ключ — идентификатор колонки, значение — название |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод записывает названия в представление `default`, а не в текущее представление. Метод не проверяет значение и заменяет прежние названия целиком.

## Примеры

**Пример.** Код задает свое название колонки и читает его:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setCustomNames(['NAME' => 'Unit']);

echo $options->GetOptions()['views']['default']['custom_names']['NAME'];
```

Код выведет `Unit`.

## Смотрите также

- [Options::save](save.md)
