---
title: Получить настройки действий Controller::getConfigurationOfActions
description: Метод Controller::getConfigurationOfActions возвращает настройки действий, которые конструктор прочитал из configureActions.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getConfigurationOfActions` возвращает настройки действий. Конструктор читает их из [configureActions](configure-actions.md) один раз.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getConfigurationOfActions()
```

## Возвращаемое значение

Метод возвращает массив `имя действия => настройки`. Кроме действий из `configureActions` в массив попадают методы-действия с атрибутами фильтров и действия, которые добавили обработчики события `onBuildActions`. Остальные действия-методы в массив не попадают.

## Примеры

**Пример.** Код выводит настройки действия:

```php
<?php
use Bitrix\Main\Engine\ActionFilter;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['list' => ['-prefilters' => [ActionFilter\Csrf::class]]];
    }

    public function listAction(): array
    {
        return [];
    }
}

$config = (new UnitController())->getConfigurationOfActions();

echo implode(',', array_keys($config)) . ' ' . $config['list']['-prefilters'][0];
```

Код выведет `list Bitrix\Main\Engine\ActionFilter\Csrf`.

## Смотрите также

- [Controller::configureActions](configure-actions.md)
- [Controller::listNameActions](list-name-actions.md)
