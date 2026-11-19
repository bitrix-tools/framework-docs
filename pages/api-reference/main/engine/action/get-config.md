---
title: Получить описание действия Action::getConfig
description: Метод Action::getConfig возвращает описание действия из configureActions контроллера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getConfig` возвращает описание действия, которое контроллер передал в конструктор. Контроллер собирает описание из `configureActions`, атрибутов фильтров у методов действий и обработчиков события построения конфигурации. Ключи описания — `class`, `configure`, `prefilters`, `postfilters` и другие.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getConfig()
```

## Возвращаемое значение

Метод возвращает значение параметра `config` конструктора. Для действия, созданного конструктором без описания, это пустой массив.

У действий, которые контроллер создает сам, бывают другие значения. Для действия-метода контроллера без описания в `configureActions` метод возвращает `null`. Для действия из ключа `callable` метод всегда возвращает пустой массив.

## Примеры

**Пример.** Код читает дополнительный ключ `cacheTtl` из описания действия:

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
                'cacheTtl' => 3600,
                'prefilters' => [],
            ],
        ];
    }
}

class UnitViewAction extends Action
{
    public function run()
    {
        return $this->getConfig()['cacheTtl'] ?? 0;
    }
}

echo (new UnitsController())->run('view', [[]]);
```

Код выведет `3600`. Пустой список `prefilters` отключает префильтры действия, чтобы пример работал из консоли. В рабочем контроллере оставьте фильтры авторизации и проверки CSRF.

## Смотрите также

- [Action::configure](configure.md)
- [Action::getName](get-name.md)
