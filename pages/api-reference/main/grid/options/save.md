---
title: Сохранить настройки грида Options::save
description: Метод Grid\Options::save сохраняет настройки грида в CUserOptions для авторизованного пользователя или в сессию для гостя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::save` сохраняет все настройки грида. Большинство методов `set*` меняют настройки только в объекте, а `save` записывает их. Исключения — `setExpandedRows` и `setCollapsedGroups`, они пишут в сессию сразу.

Метод переопределяет `CGridOptions::Save`, который сохраняет настройки только в `CUserOptions`.

Сигнатура метода в классе `Bitrix\Main\Grid\Options`:

```php
public function save()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Для авторизованного пользователя метод записывает настройки в `CUserOptions` в категорию `main.interface.grid` под именем, равным идентификатору грида. Для гостя метод записывает настройки в сессию.

## Примеры

**Пример.** Код меняет размер страницы, сохраняет настройки и читает их новым объектом:

```php
<?php
use Bitrix\Main\Grid\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options('units_grid');
$options->setPageSize(25);
$options->save();

echo (new Options('units_grid'))->getCurrentOptions()['page_size'];
```

Код выведет `25`.

## Смотрите также

- [Options::__construct](construct.md)
- [Options::setPageSize](set-page-size.md)
