---
title: Проверить общие настройки Options::isCommon
description: Статический метод Options::isCommon проверяет, что запись настроек общая — ее USER_ID равен 0.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Options::isCommon` проверяет, что запись настроек общая — ее `USER_ID` равен `0`. Метод нужен при переборе записей настроек, например из `CUserOptions::GetList`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public static function isCommon($options)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| options\* | `array` | Задает запись настроек с ключом `USER_ID` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если ключ `USER_ID` есть и равен `0`, иначе `false`.

## Примеры

**Пример.** Код проверяет три записи:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Options::isCommon(['USER_ID' => 0]), Options::isCommon(['USER_ID' => 5]), Options::isCommon([]));
```

Код выведет:

```text
bool(true)
bool(false)
bool(false)
```

## Смотрите также

- [Options::getAllUserOptions](get-all-user-options.md)
