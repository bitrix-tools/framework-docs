---
title: Задать переименование колонок Result::setReplacedAliases
description: Метод ORM\Query\Result::setReplacedAliases задает, под какими именами fetch вернет колонки результата.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Result::setReplacedAliases` задает переименование колонок. Метод [fetch](fetch.md) вернет колонку под новым именем. Метод вызывает [DB\Result::setReplacedAliases](../../../db/result/set-replaced-aliases.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Result`:

```php
public function setReplacedAliases(array $replacedAliases)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| replacedAliases\* | `array` | Задает переименование в виде `имя в запросе => имя в строке` |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Если псевдоним поля длиннее, чем допускает база данных, запрос сокращает его до вида `FALIAS_0` и сам задает переименование у внутреннего результата.
- Метод заменяет это переименование. Если запрос сократил псевдонимы, после вызова [fetch](fetch.md) вернет колонки под сокращенными именами. Чтобы дополнить список, используйте [addReplacedAliases](add-replaced-aliases.md).

## Примеры

**Пример.** Код возвращает колонку `LID` под именем `CODE`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$result = LanguageTable::getList(['select' => ['LID'], 'filter' => ['=LID' => 'en']]);
$result->setReplacedAliases(['LID' => 'CODE']);

var_export($result->fetch());
```

Код выведет:

```text
array (
  'CODE' => 'en',
)
```

## Смотрите также

- [Result::addReplacedAliases](add-replaced-aliases.md)
