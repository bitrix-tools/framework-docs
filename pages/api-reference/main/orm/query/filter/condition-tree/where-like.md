---
title: Сравнить с шаблоном ConditionTree::whereLike
description: Метод ConditionTree::whereLike добавляет условие LIKE. Метод не добавляет символы % сам.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `ConditionTree::whereLike` добавляет условие `LIKE` — значение поля совпадает с шаблоном. Символ `%` означает любую последовательность символов, `_` — один символ.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function whereLike($column, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| column\* | `string` | Задает имя поля |
| value\* | `string` | Задает шаблон, например `'Eng%'` |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает тот же объект `ConditionTree`.

## Особенности

- Метод не добавляет `%` сам. Шаблон `'Eng'` найдет только точное совпадение.
- Метод не экранирует `%` и `_` в значении. Если код строит шаблон из данных пользователя, экранируйте эти символы, иначе пользователь сможет искать по любой маске.
- В MySQL регистр зависит от правил сравнения колонки. С `*_ci` регистр не учитывается, с `*_bin` — учитывается. В PostgreSQL метод строит `ILIKE`, и регистр не учитывается.

## Примеры

**Пример.** Код ищет языки, название которых начинается на `Eng`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::getList([
    'select' => ['LID'],
    'filter' => Query::filter()->whereLike('NAME', 'Eng%'),
])->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en`.

## Смотрите также

- [ConditionTree::whereNotLike](where-not-like.md)
- [ConditionTree::whereMatch](where-match.md)
