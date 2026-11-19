---
title: Задать смещение объединения Query::setUnionOffset
description: Метод Query::setUnionOffset задает смещение всего результата UNION.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::setUnionOffset` задает, сколько записей объединения пропустить. Смещение работает только вместе с [setUnionLimit](set-union-limit.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function setUnionOffset($offset)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `int` | Задает число пропущенных записей |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Query`.

## Примеры

**Пример.** Код выбирает вторую запись объединения:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$rows = LanguageTable::query()->setSelect(['LID'])->where('LID', 'en')
    ->union(LanguageTable::query()->setSelect(['LID'])->where('LID', 'ru'))
    ->setUnionOrder('LID')
    ->setUnionLimit(1)
    ->setUnionOffset(1)
    ->fetchAll();

echo $rows[0]['LID'];
```

Код выведет `ru`.

## Смотрите также

- [Query::setUnionLimit](set-union-limit.md)
