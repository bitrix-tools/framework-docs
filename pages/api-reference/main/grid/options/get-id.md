---
title: Получить идентификатор грида Options::getId
description: Метод Grid\Options::getId возвращает идентификатор грида, который передали в конструктор.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::getId` возвращает идентификатор грида, который передали в конструктор. Под этим идентификатором класс хранит настройки.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function getId()
```

## Возвращаемое значение

Метод возвращает значение параметра `gridId` конструктора без изменений.

## Примеры

**Пример.** Код выводит идентификатор грида:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Options('units_grid'))->getId();
```

Код выведет `units_grid`.

## Смотрите также

- [Options::__construct](construct.md)
