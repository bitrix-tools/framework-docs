---
title: Задать функции преобразования Result::setConverters
description: Метод ORM\Query\Result::setConverters заменяет функции, которые fetch применяет к значениям колонок.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setConverters` заменяет функции преобразования значений колонок. Метод вызывает [DB\Result::setConverters](../../../db/result/set-converters.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setConverters($converters)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| converters\* | `callable[]` | Задает функции в виде `имя колонки => функция`. Функция принимает значение и возвращает новое. Пустой массив отключает преобразования, в том числе дат |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод заменяет весь список. Чтобы добавить свою функцию к стандартным, получите список методом [getConverters](get-converters.md) и дополните его. Чтобы изменить всю строку целиком, используйте [addFetchDataModifier](add-fetch-data-modifier.md).

## Примеры

**Пример.** Код приводит название языка к верхнему регистру:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID', 'NAME'], 'filter' => ['=LID' => 'en']]);

$converters = $result->getConverters();
$converters['NAME'] = static fn($value) => mb_strtoupper($value);
$result->setConverters($converters);

echo $result->fetch()['NAME'];
```

Код выведет `ENGLISH`.

## Смотрите также

- [Result::getConverters](get-converters.md)
