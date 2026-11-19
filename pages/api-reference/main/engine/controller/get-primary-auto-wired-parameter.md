---
title: Получить основное правило автоподстановки Controller::getPrimaryAutoWiredParameter
description: Метод Controller::getPrimaryAutoWiredParameter возвращает правило автоподстановки, которое ядро проверяет первым.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getPrimaryAutoWiredParameter` возвращает основное правило автоподстановки. При равном приоритете ядро проверяет его раньше правил из [getAutoWiredParameters](get-auto-wired-parameters.md). Наследник переопределяет метод, когда большинство действий работает с одним типом объекта.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function getPrimaryAutoWiredParameter()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Engine\AutoWire\Parameter` или `null`. Базовый класс возвращает `null`.

## Примеры

**Пример.** Код задает основное правило и передает объект в действие:

```php
<?php
use Bitrix\Main\Engine\AutoWire\Parameter;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class Unit
{
    public function __construct(public int $id)
    {
    }
}

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['view' => ['prefilters' => []]];
    }

    public function getPrimaryAutoWiredParameter()
    {
        return new Parameter(Unit::class, static fn(string $className, int $id) => new Unit($id));
    }

    public function viewAction(Unit $unit): int
    {
        return $unit->id;
    }
}

echo (new UnitController())->run('view', [['unitId' => 7]]);
```

Код выведет `7`.

## Смотрите также

- [Controller::getAutoWiredParameters](get-auto-wired-parameters.md)
