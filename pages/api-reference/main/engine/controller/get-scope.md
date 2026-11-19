---
title: Получить область вызова Controller::getScope
description: Метод Controller::getScope возвращает область вызова контроллера — ajax, rest или cli.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getScope` возвращает область, из которой вызвали контроллер, — AJAX-запрос, REST или консоль. Фильтры `Scope` проверяют область и разрешают действие только в нужной.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getScope()
```

## Возвращаемое значение

Метод возвращает строку — значение константы `Controller::SCOPE_AJAX`, `SCOPE_REST` или `SCOPE_CLI`. По умолчанию — `'ajax'`.

## Примеры

**Пример.** Код читает область по умолчанию:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

echo (new UnitController())->getScope();
```

Код выведет `ajax`.

## Смотрите также

- [Controller::setScope](set-scope.md)
