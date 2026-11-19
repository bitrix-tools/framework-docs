---
title: Выполнить действие другого контроллера Controller::forward
description: Метод Controller::forward выполняет действие другого контроллера с тем же запросом, пользователем и областью и возвращает его результат.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::forward` выполняет действие другого контроллера внутри текущего действия. Метод передает другому контроллеру запрос, область и текущего пользователя, выполняет действие методом [run](run.md) и переносит ошибки другого контроллера в текущий.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function forward($controller, string $actionName, ?array $parameters = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| controller\* | `Controller` или `string` | Задает контроллер объектом или именем класса. Если передано имя класса, метод создает объект сам |
| actionName\* | `string` | Задает имя действия |
| parameters | `array` или `null` | Задает параметры действия. По умолчанию — `null`. Тогда метод передает источники параметров текущего действия |

Сигнатура PHP объявляет типы `actionName` и `parameters`.

## Возвращаемое значение

Метод возвращает результат действия другого контроллера.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Метод вызвали вне выполняемого действия, например до [run](run.md). Текст — `Could not get current action for <класс>` |

## Особенности

Пока выполняется другое действие, метод отключает фильтры текущего действия, а затем подключает их снова. Фильтры другого действия работают без изменений.

## Примеры

**Пример.** Код передает выполнение действию другого контроллера:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['list' => ['prefilters' => []]];
    }

    public function listAction(int $limit = 2): array
    {
        return array_slice(['kg', 'g', 't'], 0, $limit);
    }
}

class CatalogController extends Controller
{
    public function configureActions()
    {
        return ['units' => ['prefilters' => []]];
    }

    public function unitsAction(): array
    {
        return $this->forward(UnitController::class, 'list', ['limit' => 1]);
    }
}

echo implode(',', (new CatalogController())->run('units', [[]]));
```

Код выведет `kg`.

## Смотрите также

- [Controller::run](run.md)
