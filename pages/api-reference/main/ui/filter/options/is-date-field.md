---
title: Проверить ключ поля даты Options::isDateField
description: Статический метод Options::isDateField проверяет, что ключ заканчивается на _datesel — ключ типа периода поля даты.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isDateField` проверяет, что ключ заканчивается на `_datesel`. С этим ключом фильтр хранит тип периода поля даты, например `CREATED_datesel` = `CURRENT_MONTH`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isDateField($key = "")
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| key | `string` | Задает ключ значения. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если ключ — строка с окончанием `_datesel`, иначе `false`.

## Примеры

**Пример.** Код проверяет два ключа:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Options::isDateField('CREATED_datesel'), Options::isDateField('CREATED_from'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Options::fetchDateFieldValue](fetch-date-field-value.md)
