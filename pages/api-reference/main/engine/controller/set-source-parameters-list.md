---
title: Задать источники параметров Controller::setSourceParametersList
description: Метод Controller::setSourceParametersList задает список массивов, из которых ядро подбирает аргументы действия.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::setSourceParametersList` задает источники параметров действия. Метод [run](run.md) вызывает его сам со своим аргументом. Метод нужен, когда действие создают и выполняют без `run`, например в тестах объекта [Action](../action/index.md).

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function setSourceParametersList($sourceParametersList)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sourceParametersList\* | `array[]` | Задает список источников, например `[['id' => 5]]` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Controller`.

## Примеры

**Пример.** Код задает параметры и выполняет действие без `run`:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\InlineAction;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function viewAction(int $id): int
    {
        return $id * 10;
    }
}

$controller = (new UnitController())->setSourceParametersList([['id' => 5]]);
$action = new InlineAction('view', $controller, []);

echo $action->runWithSourceParametersList();
```

Код выведет `50`. Без `run` фильтры и события контроллера не работают.

## Смотрите также

- [Controller::getSourceParametersList](get-source-parameters-list.md)
- [Action::runWithSourceParametersList](../action/run-with-source-parameters-list.md)
