---
title: Создать дерево условий Query::filter
description: Статический метод Query::filter создает новое пустое дерево условий ConditionTree для вложенных групп условий.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Query::filter` создает новое пустое дерево условий [ConditionTree](../filter/condition-tree/index.md). Дерево нужно для вложенной группы условий, например `(A OR B) AND C`. Код строит группу и передает ее в `where`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public static function filter()
```

## Возвращаемое значение

Метод возвращает новый объект `Bitrix\Main\ORM\Query\Filter\ConditionTree`.

## Примеры

**Пример.** Код выбирает языки по группе условий через `OR`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()
    ->setSelect(['LID'])
    ->where('ACTIVE', 'Y')
    ->where(Query::filter()->logic('or')->where('LID', 'ru')->where('LID', 'en'))
    ->setOrder('LID')
    ->fetchAll();

echo implode(',', array_column($rows, 'LID'));
```

Код выведет `en,ru`.

## Смотрите также

- [ConditionTree](../filter/condition-tree/index.md)
- [Query::getFilterHandler](get-filter-handler.md)
