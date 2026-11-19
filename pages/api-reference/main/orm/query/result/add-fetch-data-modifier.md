---
title: Добавить обработчик строки Result::addFetchDataModifier
description: Метод ORM\Query\Result::addFetchDataModifier добавляет функцию, которая меняет каждую строку перед возвратом из fetch.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::addFetchDataModifier` добавляет функцию, которая меняет строку целиком. Метод [fetch](fetch.md) вызывает функцию для каждой строки после преобразования значений. Функция нужна, например, чтобы добавить в строку вычисляемое значение. Метод вызывает [DB\Result::addFetchDataModifier](../../../db/result/add-fetch-data-modifier.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function addFetchDataModifier($fetchDataModifier)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| fetchDataModifier\* | `callable` | Задает функцию. Функция принимает строку массивом и возвращает измененную строку. Функция может менять строку по ссылке и ничего не возвращать |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | Аргумент — не функция |

## Особенности

Функция получает строку до того, как [fetch](fetch.md) уберет служебные поля. Поэтому в строке могут быть колонки вида `UALIAS_0`.

## Примеры

**Пример.** Код добавляет в строку подпись языка:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID', 'NAME'], 'filter' => ['=LID' => 'en']]);
$result->addFetchDataModifier(
    static function (array $row): array
    {
        $row['LABEL'] = $row['NAME'] . ' (' . $row['LID'] . ')';
        return $row;
    }
);

echo $result->fetch()['LABEL'];
```

Код выведет `English (en)`.

## Смотрите также

- [Result::setConverters](set-converters.md)
