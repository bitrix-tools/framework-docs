---
title: Задать текущего пользователя Controller::setCurrentUser
description: Метод Controller::setCurrentUser задает пользователя, от имени которого контроллер выполняет действие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::setCurrentUser` задает пользователя для действий контроллера. Ядро вызывает метод само, когда создает контроллер для запроса. Метод [forward](forward.md) передает пользователя другому контроллеру этим методом.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function setCurrentUser(CurrentUser $currentUser): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| currentUser\* | `Bitrix\Main\Engine\CurrentUser` | Задает пользователя, например `CurrentUser::get()` |

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- Метод не авторизует пользователя. Фильтр `Authentication` проверяет авторизацию по глобальному объекту `$USER`, а не по этому значению.
- Аргумент действия с типом `CurrentUser` ядро заполняет вызовом `CurrentUser::get()`, а не значением из этого метода.

## Примеры

**Пример.** Код задает пользователя, и действие читает его методом `getCurrentUser`:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['who' => ['prefilters' => []]];
    }

    public function whoAction(): string
    {
        return $this->getCurrentUser()->getId() ? 'user' : 'guest';
    }
}

$controller = new UnitController();
$controller->setCurrentUser(CurrentUser::get());

echo $controller->run('who', [[]]);
```

Код выведет `guest`.

## Смотрите также

- [Controller::getCurrentUser](get-current-user.md)
