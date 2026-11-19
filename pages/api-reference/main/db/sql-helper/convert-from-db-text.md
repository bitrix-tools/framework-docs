---
title: Преобразовать текст из базы данных SqlHelper::convertFromDbText
description: Метод SqlHelper::convertFromDbText приводит значение текстовой колонки к строке PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertFromDbText` приводит значение текстовой колонки к строке PHP. Метод вызывает [convertFromDbString](convert-from-db-string.md) без ограничения длины.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertFromDbText($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `mixed` | Задает значение из базы данных |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string`. Значение `null` метод превращает в пустую строку.

## Примеры

**Пример.** Код приводит значение `null` к строке:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getConnection()->getSqlHelper()->convertFromDbText(null));
```

## Смотрите также

- [SqlHelper::convertToDbText](convert-to-db-text.md)
