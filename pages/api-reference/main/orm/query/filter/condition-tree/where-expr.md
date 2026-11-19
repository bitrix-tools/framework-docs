---
title: Добавить условие из SQL-выражения ConditionTree::whereExpr
description: Метод ConditionTree::whereExpr добавляет условие из SQL-выражения с подстановкой полей, например LENGTH(%s) > 3.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereExpr` добавляет условие из SQL-выражения. Метод подставляет поля вместо `%s`, как [ExpressionField](../../../fields/expression-field/index.md). Выражение должно возвращать истину или ложь, например `LENGTH(%s) > 3`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereExpr($expr, $arguments)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| expr\* | `string` | Задает SQL-выражение с подстановками `%s` |
| arguments\* | `string[]` | Задает поля для подстановки по порядку |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

- Метод вставляет выражение в SQL как есть. Не подставляйте в выражение данные пользователя — это открывает путь к SQL-инъекции. Значения передавайте через `where` и `Query::expr()`.
- Если выражение содержит агрегатную функцию, запрос перенесет в `HAVING` все условие корневого уровня. Для фильтра, который передан в `getList`, это весь фильтр вместе с обычными условиями. Не смешивайте в одном дереве агрегатные и обычные условия.

## Примеры

**Пример.** Код выбирает языки с названием длиннее 6 символов:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereExpr('LENGTH(%s) > 6', ['NAME']),
    'order' => ['LID' => 'ASC'],
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en,ru`.

## Смотрите также

- [ConditionTree::where](where.md)
- [ExpressionField](../../../fields/expression-field/index.md)
