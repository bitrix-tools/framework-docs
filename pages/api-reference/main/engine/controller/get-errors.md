---
title: Получить ошибки Controller::getErrors
description: Метод Controller::getErrors возвращает ошибки контроллера — от фильтров, действия, исключений и подбора аргументов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getErrors` возвращает ошибки контроллера. В коллекцию попадают ошибки фильтров, ошибки, которые добавило действие методом `addError`, и исключения из [run](run.md). Ядро отдает ошибки клиенту в ответе со статусом `error`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getErrors()
```

## Возвращаемое значение

Метод возвращает массив объектов `Bitrix\Main\Error`. Если ошибок нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выполняет действие, которое сообщает об ошибке:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['view' => ['prefilters' => []]];
    }

    public function viewAction(int $id)
    {
        $this->addError(new Error('Unit not found', 'UNIT_NOT_FOUND'));

        return null;
    }
}

$controller = new UnitController();
$controller->run('view', [['id' => 999]]);

foreach ($controller->getErrors() as $error)
{
    echo $error->getCode() . ': ' . $error->getMessage();
}
```

Код выведет `UNIT_NOT_FOUND: Unit not found`.

## Смотрите также

- [Controller::hasErrors](has-errors.md)
- [Controller::getErrorByCode](get-error-by-code.md)
