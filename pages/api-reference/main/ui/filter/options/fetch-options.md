---
title: Прочитать сохраненные настройки Options::fetchOptions
description: Метод Options::fetchOptions читает сохраненные настройки фильтра текущего пользователя или общие настройки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::fetchOptions` читает сохраненные настройки фильтра. Конструктор вызывает его сам. В отличие от [getOptions](get-options.md), метод не добавляет пресеты по умолчанию и служебные ключи.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function fetchOptions($id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает идентификатор фильтра |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив настроек или пустой массив.

## Особенности

Метод ищет настройки по порядку.

1. Настройки пользователя категории `main.ui.filter`, если пользователь авторизован.
2. Общие настройки категории `main.ui.filter.common`.

Для гостя метод сначала берет настройки из локального хранилища сессии, если [save](save.md) их туда записал. Метод ищет их по идентификатору объекта, а не по `id`.

## Примеры

**Пример.** Код читает настройки фильтра без сохраненных данных:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_export((new Options('units_filter'))->fetchOptions('units_filter'));
```

Код выведет:

```text
array (
)
```

## Смотрите также

- [Options::save](save.md)
- [Options::hasOptions](has-options.md)
