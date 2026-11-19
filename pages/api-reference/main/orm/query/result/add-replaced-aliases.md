---
title: Добавить переименование колонок Result::addReplacedAliases
description: Метод ORM\Query\Result::addReplacedAliases добавляет переименование колонок к уже заданному.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::addReplacedAliases` добавляет переименование колонок к уже заданному. В отличие от [setReplacedAliases](set-replaced-aliases.md), метод сохраняет переименование, которое задала ORM. Метод вызывает [DB\Result::addReplacedAliases](../../../db/result/add-replaced-aliases.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function addReplacedAliases(array $replacedAliases)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| replacedAliases\* | `array` | Задает переименование в виде `имя в запросе => имя в строке` |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код переименовывает две колонки:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID', 'NAME'], 'filter' => ['=LID' => 'en']]);
$result->addReplacedAliases(['LID' => 'CODE']);
$result->addReplacedAliases(['NAME' => 'TITLE']);

echo implode(',', array_keys($result->fetch()));
```

Код выведет `CODE,TITLE`.

## Смотрите также

- [Result::setReplacedAliases](set-replaced-aliases.md)
