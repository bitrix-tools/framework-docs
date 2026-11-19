---
title: Задать поля выборки Query::setSelect
description: Метод Query::setSelect задает поля выборки запроса — имена полей, поля связанных сущностей и выражения.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setSelect` задает поля выборки и заменяет прежние.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setSelect(array $select)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| select\* | `array` | Задает поля. Формат элементов — в таблице ниже |

| Элемент | Что выбирает |
| --- | --- |
| `'NAME'` | Поле сущности |
| `'ALIAS' => 'NAME'` | Поле под псевдонимом |
| `'*'` | Все скалярные поля |
| `'LANG.NAME'` | Поле связанной сущности |
| `'LANG.*'` | Все скалярные поля связанной сущности. Ключи получат префикс `LANG_` или префикс из ключа, например `'L_' => 'LANG.*'` |
| `'UF_*'` | Все пользовательские поля |
| Объект `ExpressionField` | Выражение. Псевдоним — имя поля или ключ |

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\ArgumentException` | При построении SQL — если элемент задан массивом с описанием выражения. Запрос больше не поддерживает этот формат. Также — если псевдоним совпадает с полем сущности |

## Примеры

**Пример.** Код выбирает поле и выражение:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$row = LanguageTable::query()
    ->setSelect(['LID', new ExpressionField('LID_UP', 'UPPER(%s)', 'LID')])
    ->where('LID', 'ru')
    ->fetch();

echo json_encode($row);
```

Код выведет `{"LID":"ru","LID_UP":"RU"}`.

## Смотрите также

- [Query::addSelect](add-select.md)
- [ExpressionField](../../fields/expression-field/index.md)
