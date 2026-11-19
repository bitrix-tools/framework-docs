---
title: Добавить поле запроса Query::registerRuntimeField
description: Метод Query::registerRuntimeField добавляет поле только для этого запроса — выражение или связь, которых нет в getMap.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::registerRuntimeField` добавляет поле только для этого запроса, например выражение или связь с другой таблицей, которых нет в описании сущности. Поле можно выбрать, использовать в фильтре, группировке и сортировке. В `getList` такие поля задает параметр `runtime`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function registerRuntimeField($name, $fieldInfo = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string`, `null` или `Field` | Задает имя поля. Можно передать объект поля — тогда второй параметр не нужен |
| fieldInfo | `array`, `Field` или `null` | Задает поле объектом или описанием массивом. По умолчанию — `null` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

- Метод клонирует объект поля и добавляет копию в сущность запроса. Сущность таблицы не меняется.
- Поле с именем, которое уже есть в сущности, молча заменяет прежнее поле в сущности запроса. Предупреждение PHP возникнет, только если запрос создали из другого запроса.

## Примеры

**Пример.** Код добавляет выражение и сортирует по нему:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Fields\ExpressionField;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()
    ->registerRuntimeField(new ExpressionField('LID_UP', 'UPPER(%s)', 'LID'))
    ->setSelect(['LID_UP'])
    ->setOrder('LID_UP')
    ->fetchAll();

echo implode(',', array_column($rows, 'LID_UP'));
```

Код выведет коды языков в верхнем регистре, например `EN,RU`.

## Смотрите также

- [ExpressionField](../../fields/expression-field/index.md)
- [Query::getRuntimeChains](get-runtime-chains.md)
