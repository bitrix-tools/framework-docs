---
title: Получить текущего пользователя Controller::getCurrentUser
description: Метод Controller::getCurrentUser возвращает пользователя, от имени которого контроллер выполняет действие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getCurrentUser` возвращает пользователя, от имени которого контроллер выполняет действие. Ядро задает пользователя, когда создает контроллер для запроса.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getCurrentUser(): ?CurrentUser
```

## Возвращаемое значение

Метод возвращает объект [CurrentUser](../current-user/index.md) или `null`, если пользователь не задан.

## Особенности

- Если код создает контроллер конструктором, пользователя нет. Задайте его методом [setCurrentUser](set-current-user.md) или используйте `CurrentUser::get()`.
- Для контроллера компонента `Bitrix\Main\Engine\Component\ComponentController` ядро пользователя не задает, и метод возвращает `null`. Пользователя задают только класс `ControllerBuilder` и метод [forward](forward.md).
- Аргумент действия с типом [CurrentUser](../current-user/index.md) ядро заполняет вызовом `CurrentUser::get()`, а не этим методом.

## Примеры

**Пример.** Код задает пользователя и читает его идентификатор:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\CurrentUser;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

$controller = new UnitController();
$before = $controller->getCurrentUser();
$controller->setCurrentUser(CurrentUser::get());

echo var_export($before, true) . ' ' . var_export($controller->getCurrentUser()->getId(), true);
```

Код выведет `NULL '0'`. Скрипт работает без авторизации, поэтому идентификатор пользователя — строка `'0'`.

## Смотрите также

- [Controller::setCurrentUser](set-current-user.md)
- [CurrentUser](../current-user/index.md)
