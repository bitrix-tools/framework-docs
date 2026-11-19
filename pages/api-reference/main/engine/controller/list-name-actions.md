---
title: Получить имена действий Controller::listNameActions
description: Метод Controller::listNameActions возвращает имена действий из configureActions и публичных методов с суффиксом Action.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::listNameActions` возвращает имена всех действий контроллера. Метод собирает имена из [configureActions](configure-actions.md) и из публичных методов, имя которых заканчивается на `Action`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function listNameActions(): array
```

## Возвращаемое значение

Метод возвращает массив имен. Метод приводит имена действий-методов к нижнему регистру, например для `getListAction` вернет `getlist`. Имена из настроек метод возвращает как есть.

## Особенности

- Метод убирает повторы функцией `array_unique`, поэтому ключи массива идут с пропусками. Перебирайте результат в `foreach` или применяйте `array_values`.
- Функция `array_unique` учитывает регистр. Если имя действия в настройках записано как `getList`, в списке будут и `getList`, и `getlist`.
- Метод считает действием любой публичный метод с суффиксом `Action`, в том числе метод базового класса `getCurrentAction`. Поэтому в списке есть имя `getcurrent`.

## Примеры

**Пример.** Код выводит имена действий контроллера:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['import' => ['prefilters' => []]];
    }

    public function getListAction(): array
    {
        return [];
    }
}

echo implode(',', array_values((new UnitController())->listNameActions()));
```

Код выведет `import,getlist,getcurrent`.

## Смотрите также

- [Controller::configureActions](configure-actions.md)
- [Controller::generateActionMethodName](generate-action-method-name.md)
