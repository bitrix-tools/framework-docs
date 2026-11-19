---
title: Создать контроллер Controller::__construct
description: Конструктор Controller создает контроллер с областью ajax, текущим запросом и настройками действий из configureActions.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Конструктор `Controller::__construct` создает контроллер. Конструктор задает область `ajax`, берет запрос и вызывает защищенный метод `init`. Метод `init` читает настройки действий из [configureActions](configure-actions.md).

Ядро создает контроллер само, когда обрабатывает запрос к `/bitrix/services/main/ajax.php`. Прикладной код создает контроллер сам, например в тестах и консольных командах.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function __construct(?Request $request = null)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| request | `Bitrix\Main\Request` или `null` | Задает запрос. По умолчанию — `null`. Тогда конструктор берет текущий запрос из контекста |

## Особенности

- Конструктор не задает текущего пользователя. Ядро задает его само, когда создает контроллер для запроса. Для `ComponentController` ядро пользователя не задает. Если создаете контроллер сами, задайте пользователя методом [setCurrentUser](set-current-user.md).
- Чтобы подготовить контроллер, переопределите защищенный метод `init`, а не конструктор. В начале своего `init` вызовите `parent::init()`, иначе контроллер не прочитает настройки действий.

## Примеры

**Пример.** Код создает контроллер и проверяет его настройки по умолчанию:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function listAction(): array
    {
        return ['kg', 'g'];
    }
}

$controller = new UnitController();

echo $controller->getScope() . ' ' . var_export($controller->getCurrentUser(), true);
```

Код выведет `ajax NULL`.

## Смотрите также

- [Controller::run](run.md)
- [Контроллеры](../../../../framework/controllers.md)
