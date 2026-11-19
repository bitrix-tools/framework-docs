---
title: Получить строку массивом Result::fetch
description: Метод ORM\Query\Result::fetch возвращает следующую строку выборки массивом без служебных полей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::fetch` возвращает следующую строку выборки массивом. Ключи массива — имена или псевдонимы полей из `select`.

Метод вызывает [DB\Result::fetch](../../../db/result/fetch.md) и убирает из строки служебные поля, которые задал [setHiddenObjectFields](set-hidden-object-fields.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function fetch(?\Bitrix\Main\Text\Converter $converter = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| converter | `Bitrix\Main\Text\Converter` или `null` | Задает преобразование значений, например `Bitrix\Main\Text\HtmlConverter` для вывода в HTML. По умолчанию — `null` |

## Возвращаемое значение

Метод возвращает массив или `false`, если строк больше нет.

## Особенности

- Метод преобразует только даты — возвращает их объектами `Bitrix\Main\Type\DateTime` и `Bitrix\Main\Type\Date`. Остальные значения метод возвращает так, как их вернул драйвер базы данных, для MySQL и PostgreSQL — строками, в том числе числа.
- Метод возвращает значение поля-выражения [ExpressionField](../../fields/expression-field/index.md) строкой, даже если выражению задан целый тип. Методы [fetchObject](fetch-object.md) и [fetchCollection](fetch-collection.md) приводят значение к типу выражения.

## Примеры

**Пример.** Код читает строки по одной:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList([
    'select' => ['LID', 'NAME'],
    'filter' => ['@LID' => ['en', 'ru']],
    'order' => ['LID' => 'ASC'],
]);

while ($row = $result->fetch())
{
    echo $row['LID'] . '=' . $row['NAME'] . ' ';
}
```

Код выведет `en=English ru=Russian`.

## Смотрите также

- [Result::fetchAll](fetch-all.md)
- [Result::fetchObject](fetch-object.md)
- [DB\Result::fetch](../../../db/result/fetch.md)
