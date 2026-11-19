---
title: Получить текущего пользователя Action::getCurrentUser
description: Метод Action::getCurrentUser возвращает объект CurrentUser, который контроллер получил при обработке запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getCurrentUser` возвращает текущего пользователя контроллера. Метод вызывает метод контроллера `getCurrentUser`.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getCurrentUser()
```

## Возвращаемое значение

Метод возвращает объект [CurrentUser](../current-user/index.md) или `null`.

Объект задает класс `Bitrix\Main\Engine\ControllerBuilder`, когда ядро создает контроллер для AJAX-запроса или маршрута, и метод контроллера `forward`. Для контроллера компонента и для контроллера, созданного в коде конструктором, метод возвращает `null`. В этом случае используйте `CurrentUser::get()`.

## Примеры

**Пример.** Код возвращает идентификатор пользователя из действия и использует `CurrentUser::get()`, если у контроллера пользователя нет:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class ProfileAction extends Action
{
    public function run()
    {
        $user = $this->getCurrentUser() ?? CurrentUser::get();

        return (int)$user->getId();
    }
}

$action = new ProfileAction('profile', (new Controller())->setSourceParametersList([[]]));

echo $action->runWithSourceParametersList();
```

При запуске из консоли без авторизации код выведет `0`.

## Смотрите также

- [CurrentUser](../current-user/index.md)
- [Action::getController](get-controller.md)
