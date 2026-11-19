---
title: Включить DISTINCT Query::setDistinct
description: Метод Query::setDistinct добавляет в запрос DISTINCT, чтобы убрать повторяющиеся строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setDistinct` включает или выключает `SELECT DISTINCT`. С `DISTINCT` запрос вернет только уникальные строки.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setDistinct($distinct = true)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| distinct | `bool` | Значение `true` включает `DISTINCT`. По умолчанию — `true` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Особенности

С `DISTINCT` запрос не добавляет в выборку первичный ключ, поэтому `fetchObject` вернет объекты без него.

## Примеры

**Пример.** Код выбирает уникальные значения поля:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['ACTIVE'])->setDistinct()->fetchAll();

echo count($rows);
```

Код выведет `1`, если все языки активны.

## Смотрите также

- [Query::hasDistinct](has-distinct.md)
