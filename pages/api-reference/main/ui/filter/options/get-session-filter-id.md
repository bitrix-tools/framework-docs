---
title: Получить примененный пресет Options::getSessionFilterId
description: Метод Options::getSessionFilterId возвращает код пресета, который пользователь применил в этой сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getSessionFilterId` возвращает код пресета, который пользователь применил в этой сессии. Класс хранит его в локальном хранилище сессии.

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getSessionFilterId()
```

## Возвращаемое значение

Метод возвращает код пресета или `null`, если пользователь не применял пресет.

## Примеры

**Пример.** Код применяет временный пресет и читает его код:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_filter');
$before = $options->getSessionFilterId();
$options->setFilterSettings('tmp_filter', ['fields' => ['NAME' => 'kg']], true, false);

echo var_export($before, true) . ' ' . $options->getSessionFilterId();
```

Код выведет `NULL tmp_filter`.

## Смотрите также

- [Options::getCurrentFilterId](get-current-filter-id.md)
