---
title: Получить фильтр-массив Query::getFilter
description: Метод Query::getFilter возвращает фильтр-массив запроса, который задали setFilter и addFilter.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Query::getFilter` возвращает фильтр-массив — тот, что задали [setFilter](set-filter.md) и [addFilter](add-filter.md). Условия из методов `where*` лежат в отдельном дереве условий. Его возвращает [getFilterHandler](get-filter-handler.md).

Сигнатура метода в классе `Bitrix\Main\ORM\Query\Query`:

```php
public function getFilter()
```

## Возвращаемое значение

Метод возвращает фильтр-массив.

## Примеры

**Пример.** Код задает фильтр-массив и условие `where`, затем читает фильтр-массив:

```php
<?php
use Bitrix\Main\Localization\LanguageTable;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$query = LanguageTable::query()->setFilter(['=ACTIVE' => 'Y'])->where('LID', 'ru');

echo json_encode($query->getFilter());
```

Код выведет `{"=ACTIVE":"Y"}`.

## Смотрите также

- [Query::setFilter](set-filter.md)
- [Query::getFilterHandler](get-filter-handler.md)
