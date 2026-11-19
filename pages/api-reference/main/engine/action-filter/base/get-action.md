---
title: Получить действие фильтра Base::getAction
description: Метод ActionFilter\Base::getAction возвращает действие контроллера, к которому привязан фильтр.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::getAction` возвращает действие, к которому привязан фильтр. В методах `onBeforeAction` и `onAfterAction` фильтр получает через действие имя действия, контроллер и параметры.

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
final public function getAction()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Engine\Action` или `null`, если фильтр еще не привязали к действию методом [bindAction](bind-action.md).

## Примеры

**Пример.** Фильтр проверяет имя действия и запрещает действие `archive`. Код запускает действие через контроллер и выводит результат и ошибку фильтра:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoStatusFilter extends Base
{
    public function onBeforeAction(Event $event)
    {
        if ($this->getAction()->getName() === 'archive')
        {
            $this->addError(new Error('Archive is closed', 'ARCHIVE_CLOSED'));

            return new EventResult(EventResult::ERROR, null, null, $this);
        }

        return null;
    }
}

final class DemoStatusController extends Controller
{
    public function configureActions()
    {
        return [
            'archive' => [
                'prefilters' => [new DemoStatusFilter()],
            ],
        ];
    }

    public function archiveAction()
    {
        return ['status' => 'archived'];
    }
}

$controller = new DemoStatusController();
$result = $controller->run('archive', []);

var_dump($result);
foreach ($controller->getErrors() as $error)
{
    echo $error->getMessage();
}
```

Код выведет `NULL` и `Archive is closed`.

## Смотрите также

- [Base::bindAction](bind-action.md)
- [Base::getErrors](get-errors.md)
