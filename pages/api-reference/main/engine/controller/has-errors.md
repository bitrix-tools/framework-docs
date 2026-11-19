---
title: Проверить, есть ли ошибки Controller::hasErrors
description: Метод Controller::hasErrors проверяет, есть ли в коллекции контроллера хотя бы одна ошибка.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::hasErrors` проверяет, есть ли у контроллера ошибки. Метод нужен, например, в защищенном методе `processAfterAction`, чтобы не менять результат после ошибки.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function hasErrors(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если есть хотя бы одна ошибка, иначе `false`.

## Примеры

**Пример.** Код проверяет ошибки до и после неизвестного действия:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

$controller = new UnitController();
$before = $controller->hasErrors();
$controller->run('missing', [[]]);

var_export([$before, $controller->hasErrors(), $controller->getErrors()[0]->getCode()]);
```

Код выведет:

```text
array (
  0 => false,
  1 => true,
  2 => 22002,
)
```

## Смотрите также

- [Controller::getErrors](get-errors.md)
