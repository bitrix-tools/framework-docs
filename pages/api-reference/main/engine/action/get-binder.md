---
title: Получить объект, который подбирает аргументы, Action::getBinder
description: Метод Action::getBinder возвращает объект Binder, который подбирает аргументы метода run, или null, если действие еще не создало объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getBinder` возвращает объект, который подбирает аргументы и вызывает метод `run`. Действие создает объект при первом вызове [getArguments](get-arguments.md), [setArguments](set-arguments.md) или [runWithSourceParametersList](run-with-source-parameters-list.md).

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getBinder()
```

## Возвращаемое значение

Метод возвращает объект класса `Bitrix\Main\Engine\AutoWire\ControllerBinder`, наследника `Binder`. До первого вызова `getArguments`, `setArguments` или `runWithSourceParametersList` метод возвращает `null` и сам объект не создает.

## Примеры

**Пример.** Код выводит класс объекта до и после вызова `getArguments`:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code = 'kg')
    {
        return $code;
    }
}

$action = new UnitViewAction('view', (new Controller())->setSourceParametersList([[]]));

echo var_export($action->getBinder(), true) . ' ';
$action->getArguments();
echo get_class($action->getBinder());
```

Код выведет `NULL Bitrix\Main\Engine\AutoWire\ControllerBinder`.

## Смотрите также

- [Action::getArguments](get-arguments.md)
