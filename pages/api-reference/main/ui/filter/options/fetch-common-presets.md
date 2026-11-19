---
title: Прочитать общие пресеты Options::fetchCommonPresets
description: Статический метод Options::fetchCommonPresets читает общие пресеты текущего пользователя из настроек категории main.ui.filter.presets.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::fetchCommonPresets` читает общие пресеты текущего пользователя из настроек категории `main.ui.filter.presets`. Конструктор вызывает его сам, если получил `commonPresetsId`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function fetchCommonPresets($id)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает идентификатор общих пресетов |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает массив с ключами `filters` и `deleted_presets` или пустой массив, если пресеты не сохранены.

## Примеры

**Пример.** Код читает общие пресеты, которые еще не сохраняли:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_export(Options::fetchCommonPresets('units_common'));
```

Код выведет:

```text
array (
)
```

## Смотрите также

- [Options::isUseCommonPresets](is-use-common-presets.md)
- [Options::save](save.md)
