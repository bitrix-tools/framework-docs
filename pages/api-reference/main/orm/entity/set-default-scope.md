---
title: Добавить условия по умолчанию Entity::setDefaultScope
description: Метод Entity::setDefaultScope добавляет в запрос условия по умолчанию, которые задал класс таблицы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Entity::setDefaultScope` добавляет в запрос условия по умолчанию. Метод вызывает [DataManager::setDefaultScope](../data/data-manager/set-default-scope.md) класса таблицы. Ядро вызывает метод само, когда строит запрос.

Сигнатура метода в классе `Bitrix\Main\ORM\Entity`:

```php
public function setDefaultScope($query)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| query\* | `Bitrix\Main\ORM\Query\Query` | Задает запрос |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает результат `DataManager::setDefaultScope` — по умолчанию тот же запрос.

## Примеры

**Пример.** Код передает запрос в метод:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query();

var_dump(LanguageTable::getEntity()->setDefaultScope($query) === $query);
```

Код выведет `bool(true)`.

## Смотрите также

- [DataManager::setDefaultScope](../data/data-manager/set-default-scope.md)
