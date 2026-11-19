---
title: Проверить, задано ли собственное имя Options::hasName
description: Метод Routing\Options::hasName проверяет, задано ли собственное имя маршрута или группы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Options::hasName` проверяет, задано ли собственное имя маршрута. Маршрутизатор добавляет маршрут в список именованных, только если метод вернул `true`.

Сигнатура метода в классе `Bitrix\Main\Routing\Options`:

```php
public function hasName()
```

## Возвращаемое значение

Метод возвращает `true`, если собственное имя не пустое, иначе `false`. Метод не учитывает имена родительских групп. Маршрут без собственного имени в именованной группе именованным не считается.

## Примеры

**Пример.** Код проверяет имя до и после вызова `name`:

```php
<?php
use Bitrix\Main\Routing\Options;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$options = new Options();
$before = $options->hasName();
$options->name('unit.view');

var_export([$before, $options->hasName()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
)
```

## Смотрите также

- [Options::name](name.md)
- [Options::getFullName](get-full-name.md)
