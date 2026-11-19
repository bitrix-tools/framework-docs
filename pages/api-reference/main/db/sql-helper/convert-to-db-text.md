---
title: Преобразовать текст для SQL SqlHelper::convertToDbText
description: Метод SqlHelper::convertToDbText экранирует текст и берет его в одинарные кавычки, как convertToDbString.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SqlHelper::convertToDbText` готовит значение для текстовой колонки. Метод вызывает [convertToDbString](convert-to-db-string.md) без ограничения длины.

Сигнатура метода в классе `Bitrix\Main\DB\SqlHelper`:

```php
public function convertToDbText($value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| value\* | `string` | Задает текст |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку `string` в одинарных кавычках.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\DB\ConnectionException` | Подключиться к базе данных не удалось |

## Примеры

**Пример.** Код готовит многострочный текст:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getConnection()->getSqlHelper()->convertToDbText("Line 1\nLine 2");
```

## Смотрите также

- [SqlHelper::convertToDbString](convert-to-db-string.md)
- [SqlHelper::convertFromDbText](convert-from-db-text.md)
