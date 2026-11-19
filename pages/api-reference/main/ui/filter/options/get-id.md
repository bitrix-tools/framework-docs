---
title: Получить идентификатор фильтра Options::getId
description: Метод Options::getId возвращает идентификатор фильтра, который получил конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getId` возвращает идентификатор фильтра, который получил [конструктор](construct.md).

Сигнатура метода в классе `Bitrix\Main\UI\Filter\Options`:

```php
public function getId()
```

## Возвращаемое значение

Метод возвращает строку.

## Примеры

**Пример.** Код читает идентификатор фильтра:

```php
<?php
use Bitrix\Main\UI\Filter\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Options('units_filter'))->getId();
```

Код выведет `units_filter`.

## Смотрите также

- [Options::__construct](construct.md)
