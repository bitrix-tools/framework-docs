---
title: Запомнить свернутые группы Options::setCollapsedGroups
description: Метод Grid\Options::setCollapsedGroups запоминает в сессии идентификаторы свернутых групп строк грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::setCollapsedGroups` запоминает идентификаторы свернутых групп строк грида. Метод сразу записывает значение в сессию, вызывать [save](save.md) не нужно.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function setCollapsedGroups($ids = array())
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| ids | `array` | Задает идентификаторы свернутых групп. Если значение не массив, метод записывает пустой массив. По умолчанию — пустой массив |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код запоминает свернутую группу и читает список:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setCollapsedGroups(['weight']);

echo implode(',', $options->getCollapsedGroups());
```

Код выведет `weight`.

## Смотрите также

- [Options::getCollapsedGroups](get-collapsed-groups.md)
