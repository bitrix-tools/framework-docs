---
title: Проверить DISTINCT Query::hasDistinct
description: Метод Query::hasDistinct проверяет, есть ли в запросе DISTINCT — из setDistinct или из выражения в выборке.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::hasDistinct` проверяет, есть ли в запросе `DISTINCT`. Метод учитывает [setDistinct](set-distinct.md) и выражения выборки с `DISTINCT`, например `COUNT(DISTINCT %s)`.

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function hasDistinct()
```

## Возвращаемое значение

Метод возвращает `true`, если `DISTINCT` есть, иначе `false`.

## Особенности

- Метод проверяет выражения выборки по цепочкам, поэтому для них нужен построенный запрос.
- Если `DISTINCT` есть и в выражении, и в `setDistinct`, метод выключает признак `setDistinct`, чтобы SQL не получил `DISTINCT` дважды.

## Примеры

**Пример.** Код проверяет запрос до и после `setDistinct`:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setSelect(['ACTIVE']);
$before = $query->hasDistinct();
$query->setDistinct();

var_dump($before, $query->hasDistinct());
```

Код выведет:

```text
bool(false)
bool(true)
```

## Смотрите также

- [Query::setDistinct](set-distinct.md)
