---
title: Проверить, разрешен ли показ всех записей PageNavigation::allRecordsAllowed
description: Метод PageNavigation::allRecordsAllowed проверяет, разрешил ли allowAllRecords показ всех записей на одной странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::allRecordsAllowed` проверяет, разрешен ли показ всех записей на одной странице. Шаблоны компонентов навигации выводят ссылку «Все», если метод возвращает `true`.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function allRecordsAllowed()
```

## Возвращаемое значение

Метод возвращает `true`, если [allowAllRecords](allow-all-records.md) разрешил показ всех записей, иначе `false`. По умолчанию — `false`.

## Примеры

**Пример.** Код проверяет режим до и после `allowAllRecords`:

```php
<?php
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');
$before = $nav->allRecordsAllowed();
$nav->allowAllRecords(true);

var_export([$before, $nav->allRecordsAllowed()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [PageNavigation::allowAllRecords](allow-all-records.md)
- [PageNavigation::allRecordsShown](all-records-shown.md)
