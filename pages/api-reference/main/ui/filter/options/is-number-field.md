---
title: Проверить ключ числового поля Options::isNumberField
description: Статический метод Options::isNumberField проверяет, что ключ заканчивается на _numsel — ключ типа сравнения числового поля.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isNumberField` проверяет, что ключ заканчивается на `_numsel`. С этим ключом фильтр хранит тип сравнения числового поля, например `WEIGHT_numsel` = `more`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isNumberField($key = "")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| key | `string` | Задает ключ значения. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если ключ — строка с окончанием `_numsel`, иначе `false`.

## Примеры

**Пример.** Код проверяет два ключа:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Options::isNumberField('WEIGHT_numsel'), Options::isNumberField('WEIGHT_from'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Options::fetchNumberFieldValue](fetch-number-field-value.md)
