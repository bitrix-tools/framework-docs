---
title: Получить правила автоподстановки Controller::getAutoWiredParameters
description: Метод Controller::getAutoWiredParameters возвращает правила, по которым ядро создает объекты для аргументов действий. Наследник переопределяет его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getAutoWiredParameters` возвращает правила автоподстановки. По ним ядро создает объекты для аргументов действий с типом класса. Наследник переопределяет метод, например чтобы действие получало объект записи вместо идентификатора.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function getAutoWiredParameters()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\Engine\AutoWire\Parameter` или `ExactParameter`. Базовый класс возвращает пустой массив.

Конструктор `Parameter` принимает класс и функцию, которая создает объект. Если функция принимает два аргумента, ядро передает во второй значение параметра запроса `<имя аргумента>Id`, например `unitId` для аргумента `$unit`.

## Особенности

- Ядро сортирует правила по приоритету. Правило, функция которого принимает идентификатор `<имя>Id`, получает приоритет 2, правило без него — 1. `ExactParameter` получает на единицу больше.
- При равном приоритете ядро проверяет правило из [getPrimaryAutoWiredParameter](get-primary-auto-wired-parameter.md) раньше правил из этого метода.

## Примеры

**Пример.** Код передает действию объект единицы по параметру `unitId`:

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

    public function getAutoWiredParameters()
    {
        return [
            new Parameter(Unit::class, static fn(string $className, int $id) => new Unit($id)),
        ];
    }

    public function viewAction(Unit $unit): array
    {
        return ['id' => $unit->id];
    }
}

$result = (new UnitController())->run('view', [['unitId' => 5]]);

echo $result['id'];
```

Код выведет `5`.

## Смотрите также

- [Controller::getPrimaryAutoWiredParameter](get-primary-auto-wired-parameter.md)
- [Контроллеры](../../../../framework/controllers.md)
