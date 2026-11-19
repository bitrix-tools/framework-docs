---
title: Получить строку поиска Options::getSearchString
description: Метод Options::getSearchString возвращает строку, которую пользователь ввел в поле поиска фильтра.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getSearchString` возвращает строку, которую пользователь ввел в поле поиска фильтра. Класс хранит строку в локальном хранилище сессии. [getFilter](get-filter.md) возвращает ее в ключе `FIND`.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getSearchString()
```

## Возвращаемое значение

Метод возвращает строку. Если пользователь ничего не ввел, метод возвращает пустую строку.

## Примеры

**Пример.** Код задает строку поиска через значения пресета и читает ее:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$options->setFilterSettings('tmp_filter', ['fields' => ['FIND' => 'steel']], true, false);

echo $options->getSearchString();
```

Код выведет `steel`.

## Смотрите также

- [Options::getFilter](get-filter.md)
