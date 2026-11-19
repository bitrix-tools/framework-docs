---
title: Создать действие Action::__construct
description: Конструктор Action сохраняет имя действия, контроллер и описание действия, вызывает configure и init.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Action::__construct` создает действие для контроллера. Контроллер вызывает конструктор сам, когда находит в `configureActions` описание действия с ключом `class`. В коде приложения конструктор нужен, например, в тестах действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
public function __construct($name, Controller $controller, $config = array())
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя действия, например `view` |
| controller\* | `Bitrix\Main\Engine\Controller` | Задает контроллер, которому принадлежит действие |
| config | `array` | Задает описание действия из `configureActions`. Значение ключа `configure` конструктор передает в метод [configure](configure.md). По умолчанию — пустой массив |

Типы `name` и `config` в таблице описывают назначение аргументов. Сигнатура PHP объявляет только тип `controller`.

## Особенности

Конструктор выполняет шаги по порядку:

1. Создает пустой список ошибок и сохраняет аргументы.
2. Вызывает `configure`, если в `config` есть ключ `configure` со значением, отличным от `null`.
3. Вызывает защищенный метод `init`.

Наследник, который переопределяет конструктор, должен вызвать `parent::__construct`, иначе у действия не будет списка ошибок.

Если вы создаете действие конструктором, задайте контроллеру параметры методом `setSourceParametersList` до вызова `getArguments`, `setArguments` или `runWithSourceParametersList`. Без параметров эти методы завершатся ошибкой `TypeError`. Метод контроллера `run` задает параметры сам.

## Примеры

**Пример.** Код создает действие для контроллера и выводит его имя и описание:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code)
    {
        return ['code' => $code];
    }
}

$action = new UnitViewAction('view', new Controller(), ['class' => UnitViewAction::class]);

echo $action->getName() . ' ' . $action->getConfig()['class'];
```

Код выведет `view UnitViewAction`.

## Смотрите также

- [Action::configure](configure.md)
- [Action::getConfig](get-config.md)
