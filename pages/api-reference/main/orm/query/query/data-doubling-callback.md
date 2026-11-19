---
title: Построить условие IN с подзапросом Query::dataDoublingCallback
description: Служебный метод Query::dataDoublingCallback строит SQL поле IN (подзапрос) для disableDataDoubling.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::dataDoublingCallback` строит SQL `поле IN (подзапрос)`. Запрос использует метод, когда [disableDataDoubling](disable-data-doubling.md) заменяет условие по связи 1:N подзапросом. Прикладному коду вызывать метод не нужно.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function dataDoublingCallback($field, $operation, $value)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| field\* | `string` | Задает SQL поля |
| operation\* | `string` | Метод не использует операцию |
| value\* | `string` | Задает SQL подзапроса |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку SQL.

## Примеры

**Пример.** Код строит условие с подзапросом:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo LanguageTable::query()->dataDoublingCallback('`ID`', 'IN', 'SELECT 1');
```

Код выведет `` `ID` IN (SELECT 1) ``.

## Смотрите также

- [Query::disableDataDoubling](disable-data-doubling.md)
