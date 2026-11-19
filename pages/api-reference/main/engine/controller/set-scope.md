---
title: Задать область вызова Controller::setScope
description: Метод Controller::setScope задает область вызова контроллера — ajax, rest или cli.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::setScope` задает область вызова контроллера. Ядро вызывает метод само. Для REST ядро задает `rest`, для консольных команд — `cli`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function setScope($scope)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| scope\* | `string` | Задает область — `Controller::SCOPE_AJAX`, `SCOPE_REST` или `SCOPE_CLI`. Метод не проверяет значение |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Controller`.

## Примеры

**Пример.** Код задает область REST:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

echo (new UnitController())->setScope(Controller::SCOPE_REST)->getScope();
```

Код выведет `rest`.

## Смотрите также

- [Controller::getScope](get-scope.md)
