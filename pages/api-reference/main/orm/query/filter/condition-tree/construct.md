---
title: Создать дерево условий ConditionTree::__construct
description: Конструктор ConditionTree создает пустое дерево условий с логикой AND. Короткая запись — Query::filter().
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `ConditionTree::__construct` создает пустое дерево условий с логикой `AND`. Метод `Bitrix\Main\ORM\Query\Query::filter()` создает такой же объект — эту запись используют чаще.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Filter\ConditionTree`:

```php
public function __construct()
```

## Примеры

**Пример.** Код создает дерево двумя способами и проверяет его:

```php
<?php
use Bitrix\Main\ORM\Query\Filter\ConditionTree;
use Bitrix\Main\ORM\Query\Query;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$first = new ConditionTree();
$second = Query::filter();

echo $first->logic() . ' ' . get_class($second) . ' ' . var_export($first->hasConditions(), true);
```

Код выведет `and Bitrix\Main\ORM\Query\Filter\ConditionTree false`.

## Смотрите также

- [ConditionTree::createFromArray](create-from-array.md)
- [ConditionTree::logic](logic.md)
