---
title: Задать смещение Query::setOffset
description: Метод Query::setOffset задает, сколько записей пропустить перед выборкой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setOffset` задает, сколько записей пропустить перед выборкой. Для страницы `N` при размере страницы `S` смещение — `(N - 1) * S`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setOffset($offset)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `int` или `null` | Задает число пропущенных записей |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

Смещение работает только вместе с лимитом [setLimit](set-limit.md). Без лимита запрос не добавит смещение в SQL.

## Примеры

**Пример.** Код выбирает вторую страницу по одной записи:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->setOrder('LID')->setLimit(1)->setOffset(1)->fetchAll();

echo $rows[0]['LID'];
```

Код выведет `ru`.

## Смотрите также

- [Query::setLimit](set-limit.md)
- [PageNavigation](../../../ui/page-navigation/index.md)
