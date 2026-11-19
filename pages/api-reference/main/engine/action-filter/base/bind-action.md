---
title: Привязать фильтр к действию Base::bindAction
description: Метод ActionFilter\Base::bindAction привязывает фильтр к действию контроллера.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::bindAction` привязывает фильтр к действию контроллера. Контроллер вызывает метод сам перед запуском действия для каждого фильтра, который работает в его области. Вызывать метод из своего кода нужно, только если фильтр проверяют без контроллера.

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
final public function bindAction(Action $action)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| action\* | `Bitrix\Main\Engine\Action` | Задает действие, к которому привязывается фильтр |

## Возвращаемое значение

Метод возвращает объект фильтра. Метод сохраняет действие, метод [getAction](get-action.md) возвращает его.

## Примеры

**Пример.** Код привязывает фильтр к действию `archive` и выводит имя действия:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoStatusFilter extends Base
{
}

final class DemoStatusController extends Controller
{
}

$action = new Action('archive', new DemoStatusController());

$filter = (new DemoStatusFilter())->bindAction($action);

echo $filter->getAction()->getName();
```

Код выведет `archive`.

## Смотрите также

- [Base::getAction](get-action.md)
