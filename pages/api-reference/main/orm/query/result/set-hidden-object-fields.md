---
title: Задать служебные поля Result::setHiddenObjectFields
description: Метод ORM\Query\Result::setHiddenObjectFields задает служебные поля, которые нужны fetchObject, но не попадают в строки fetch и fetchAll.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setHiddenObjectFields` задает служебные поля результата. Поля нужны [fetchObject](fetch-object.md), но методы [fetch](fetch.md) и [fetchAll](fetch-all.md) убирают их из строк.

Метод `Query::exec` вызывает его сам. Если в `select` нет первичного ключа, запрос добавляет его под служебным именем вида `UALIAS_0` и передает имя этому методу. Прикладному коду метод не нужен.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setHiddenObjectFields($hiddenObjectFields)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| hiddenObjectFields\* | `string[]` | Задает имена колонок результата, которые нужно скрыть |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод [getIterator](get-iterator.md) не убирает служебные поля. В `foreach` по результату строки содержат их.

## Примеры

**Пример.** Код выбирает язык без первичного ключа и сравнивает `fetchAll` и `foreach`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = ['select' => ['NAME'], 'filter' => ['=LID' => 'en']];

echo implode(',', array_keys(LanguageTable::getList($query)->fetchAll()[0])) . "\n";

foreach (LanguageTable::getList($query) as $row)
{
    echo implode(',', array_keys($row));
}
```

Код выведет:

```text
NAME
NAME,UALIAS_0
```

## Смотрите также

- [Result::fetchObject](fetch-object.md)
- [Result::getIterator](get-iterator.md)
