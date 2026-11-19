---
title: Задать переименование колонок Result::setReplacedAliases
description: Метод Result::setReplacedAliases задает, какие колонки fetch переименовывает в строке результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.0

{% endnote %}

Метод `Result::setReplacedAliases` задает, какие колонки [fetch](fetch.md) переименовывает в строке результата. Метод заменяет весь список. Чтобы дополнить список, вызовите [addReplacedAliases](add-replaced-aliases.md).

ORM задает переименование, когда псевдоним колонки длиннее, чем разрешает база данных. В запрос ORM подставляет короткий псевдоним, а `fetch` возвращает колонку под исходным именем.

Сигнатура метода в классе `Bitrix\Main\DB\Result`:

```php
public function setReplacedAliases(array $replacedAliases)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| replacedAliases\* | `string[]` | Задает переименование в виде `имя в запросе => имя в строке результата` |

## Возвращаемое значение

Метод ничего не возвращает.

Метод `fetch` удаляет колонку под старым именем. Страница [fetch](fetch.md) показывает, на каком шаге метод переименовывает колонки.

## Примеры

**Пример.** Код возвращает колонку `UA` под именем `USER_LOGIN`:

```php
<?php
use Bitrix\Main\Application;
use Bitrix\Main\UserTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = Application::getConnection()->query(
    'SELECT ID, LOGIN AS UA FROM ' . UserTable::getTableName() . ' ORDER BY ID',
    1
);
$result->setReplacedAliases(['UA' => 'USER_LOGIN']);

print_r($result->fetch());
```

## Смотрите также

- [Result::addReplacedAliases](add-replaced-aliases.md)
- [Result::fetch](fetch.md)
