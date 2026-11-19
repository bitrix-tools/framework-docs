---
title: Получить выполняемое действие Controller::getCurrentAction
description: Метод Controller::getCurrentAction возвращает объект действия, которое выполняет метод run.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getCurrentAction` возвращает объект действия, которое выполняет [run](run.md). Метод нужен в фильтрах, обработчиках событий и защищенных методах контроллера, чтобы узнать имя и настройки действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getCurrentAction(): Action
```

## Возвращаемое значение

Метод возвращает объект [Action](../action/index.md), например `InlineAction` для действия-метода.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | Метод `run` еще не создал действие |

## Примеры

**Пример.** Код читает имя действия после выполнения:

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

    public function listAction(): array
    {
        return [];
    }
}

$controller = new UnitController();
$controller->run('list', [[]]);
$action = $controller->getCurrentAction();

echo get_class($action) . ' ' . $action->getName();
```

Код выведет `Bitrix\Main\Engine\InlineAction list`.

## Смотрите также

- [Action](../action/index.md)
- [Controller::run](run.md)
