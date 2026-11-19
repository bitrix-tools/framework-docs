---
title: Получить ошибки действия Action::getErrors
description: Метод Action::getErrors возвращает массив ошибок, которые действие добавило методами addError и addErrors.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getErrors` возвращает ошибки действия. Действие добавляет ошибки защищенными методами `addError` и `addErrors`. После выполнения контроллер переносит ошибки действия в свой список, и метод контроллера `getErrors` возвращает их вместе с ошибками контроллера. Если `run` выбросил исключение, контроллер ошибки действия не переносит.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getErrors()
```

## Возвращаемое значение

Метод возвращает массив объектов [Error](../../error/index.md). Если ошибок нет, метод возвращает пустой массив.

## Примеры

**Пример.** Код выполняет действие через контроллер и выводит коды ошибок, которые контроллер перенес из действия:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitsController extends Controller
{
    public function configureActions()
    {
        return [
            'view' => [
                'class' => UnitViewAction::class,
                'prefilters' => [],
            ],
        ];
    }
}

class UnitViewAction extends Action
{
    public function run(string $code)
    {
        if (!in_array($code, ['kg', 'g'], true))
        {
            $this->addError(new Error('Unknown unit', 'UNKNOWN_UNIT'));

            return null;
        }

        return ['code' => $code];
    }
}

$controller = new UnitsController();
$controller->run('view', [['code' => 'lb']]);

foreach ($controller->getErrors() as $error)
{
    echo $error->getCode();
}
```

Код выведет `UNKNOWN_UNIT`. Пустой список `prefilters` отключает префильтры действия, чтобы пример работал из консоли. В рабочем контроллере оставьте фильтры авторизации и проверки CSRF.

**Пример.** Код выполняет действие напрямую и выводит сообщения его ошибок:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code)
    {
        $this->addError(new Error('Unknown unit ' . $code, 'UNKNOWN_UNIT'));

        return null;
    }
}

$action = new UnitViewAction('view', (new Controller())->setSourceParametersList([['code' => 'lb']]));
$action->runWithSourceParametersList();

foreach ($action->getErrors() as $error)
{
    echo $error->getMessage();
}
```

Код выведет `Unknown unit lb`.

## Смотрите также

- [Action::getErrorByCode](get-error-by-code.md)
- [Error](../../error/index.md)
- [ErrorCollection](../../error-collection/index.md)
