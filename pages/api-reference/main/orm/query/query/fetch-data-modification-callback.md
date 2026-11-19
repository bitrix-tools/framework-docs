---
title: Изменить строку результата Query::fetchDataModificationCallback
description: Служебный метод Query::fetchDataModificationCallback применяет к строке результата обработчики полей выборки — addFetchDataModifier.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.5.1

{% endnote %}

Метод `Query::fetchDataModificationCallback` применяет к строке результата обработчики полей выборки. Поле получает обработчики методом `addFetchDataModifier`. Результат вызывает метод сам для каждой строки, если [isFetchModificationRequired](is-fetch-modification-required.md) вернул `true`. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function fetchDataModificationCallback(&$data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `array` | Принимает строку результата по ссылке и меняет ее |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Обработчик получает значение поля, запрос, всю строку и псевдоним поля. Он возвращает новое значение.

## Примеры

**Пример.** Код добавляет полю выражения обработчик и получает измененную строку:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$field = new ExpressionField('LID_UP', 'UPPER(%s)', 'LID');
$field->addFetchDataModifier(fn($value) => '[' . $value . ']');

$row = LanguageTable::query()->setSelect(['LID', $field])->where('LID', 'ru')->fetch();

echo $row['LID_UP'];
```

Код выведет `[RU]`.

## Смотрите также

- [Query::isFetchModificationRequired](is-fetch-modification-required.md)
