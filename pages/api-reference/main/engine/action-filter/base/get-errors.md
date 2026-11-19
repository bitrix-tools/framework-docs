---
title: Получить ошибки фильтра Base::getErrors
description: Метод ActionFilter\Base::getErrors возвращает массив ошибок, которые добавил фильтр.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::getErrors` возвращает ошибки, которые фильтр добавил методами `addError` и `addErrors`. Метод входит в интерфейс `Bitrix\Main\Errorable`. Контроллер вызывает его, когда фильтр вернул результат с ошибкой и передал себя в параметре `handler`. Ошибки фильтра контроллер добавляет в свои.

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
final public function getErrors()
```

## Возвращаемое значение

Метод возвращает массив объектов [Error](../../../error/index.md). Если ошибок нет, метод возвращает пустой массив.

## Примеры

**Пример.** Фильтр всегда добавляет ошибку `UNIT_CODE_EMPTY`. Код вызывает обработчик фильтра напрямую и выводит ошибки:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Base;
use Bitrix\Main\Error;
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoUnitCodeFilter extends Base
{
    public function onBeforeAction(Event $event)
    {
        $this->addError(new Error('Unit code is required', 'UNIT_CODE_EMPTY'));

        return new EventResult(EventResult::ERROR, null, null, $this);
    }
}

$filter = new DemoUnitCodeFilter();
$filter->onBeforeAction(new Event('main', 'OnDemoCheck'));

foreach ($filter->getErrors() as $error)
{
    echo $error->getCode() . ' ' . $error->getMessage();
}
```

Код выведет `UNIT_CODE_EMPTY Unit code is required`.

## Смотрите также

- [Base::getErrorByCode](get-error-by-code.md)
- [ErrorCollection](../../../error-collection/index.md)
