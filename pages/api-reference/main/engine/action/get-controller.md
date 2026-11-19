---
title: Получить контроллер действия Action::getController
description: Метод Action::getController возвращает контроллер, которому принадлежит действие.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getController` возвращает контроллер, которому принадлежит действие. Через контроллер действие получает запрос, параметры и настройки.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getController()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Engine\Controller` из параметра `controller` конструктора.

## Примеры

**Пример.** Код выводит класс контроллера из действия:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

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
    public function run()
    {
        return get_class($this->getController());
    }
}

echo (new UnitsController())->run('view', [[]]);
```

Код выведет `UnitsController`. Пустой список `prefilters` отключает префильтры действия, чтобы пример работал из консоли. В рабочем контроллере оставьте фильтры авторизации и проверки CSRF.

## Смотрите также

- [Action::getCurrentUser](get-current-user.md)
- [Контроллеры](../../../../framework/controllers.md)
