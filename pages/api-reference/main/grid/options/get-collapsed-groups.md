---
title: Получить свернутые группы Options::getCollapsedGroups
description: Метод Grid\Options::getCollapsedGroups возвращает из сессии идентификаторы свернутых групп строк грида или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getCollapsedGroups` возвращает идентификаторы свернутых групп строк грида, которые запомнил [setCollapsedGroups](set-collapsed-groups.md). Метод читает сессию.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getCollapsedGroups()
```

## Возвращаемое значение

Метод возвращает массив идентификаторов или `null`, если в текущей сессии метод `setCollapsedGroups` не вызывали.

## Примеры

**Пример.** Код проверяет, свернута ли группа:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$groups = (new Options('units_grid'))->getCollapsedGroups() ?? [];

echo in_array('weight', $groups, true) ? 'collapsed' : 'expanded';
```

В новой сессии код выведет `expanded`.

## Смотрите также

- [Options::setCollapsedGroups](set-collapsed-groups.md)
