---
title: Добавить переименование колонок Result::addReplacedAliases
description: Метод Result::addReplacedAliases добавляет переименование колонок к списку, заданному через setReplacedAliases.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.9.2

{% endnote %}

Метод `Result::addReplacedAliases` добавляет переименование колонок к списку, который задал [setReplacedAliases](set-replaced-aliases.md). Если имя в запросе уже есть в списке, новое значение заменяет старое.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function addReplacedAliases(array $replacedAliases)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| replacedAliases\* | `string[]` | Задает переименование в виде `имя в запросе => имя в строке результата` |

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код переименовывает две колонки двумя вызовами:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID AS A1, LOGIN AS A2 FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    1
);
$result->setReplacedAliases(['A1' => 'USER_ID']);
$result->addReplacedAliases(['A2' => 'USER_LOGIN']);

print_r($result->fetch());
```

## Смотрите также

- [Result::setReplacedAliases](set-replaced-aliases.md)
