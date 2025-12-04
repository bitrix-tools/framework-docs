---
title: События
description: 'События. Документация по Bitrix Framework: принципы работы, архитектура и примеры использования.'
---

Событие -- это действие или изменение состояния системы, например, нажатие кнопки пользователем или завершение загрузки данных. События уведомляют части приложения об изменениях, что позволяет системе реагировать на них.

В ядре D7 упрощены требования к данным для кода, который создает событие. Пример отправки события:

```php
$event = new Bitrix\Main\Event("main", "OnPageStart");
$event->send();
```

## Обработка результатов события

Чтобы получить результаты обработки события, используйте следующий код:

```php
foreach ($event->getResults() as $eventResult) {
    switch($eventResult->getType()) {
        case \Bitrix\Main\EventResult::ERROR:
            // Обработка ошибки
            break;
        case \Bitrix\Main\EventResult::SUCCESS:
            // Успешно
            $handlerRes = $eventResult->getParameters(); // Результат от обработчика
            break;
        case \Bitrix\Main\EventResult::UNDEFINED:
            // Неизвестный объект, результат доступен через getParameters
            break;
    }
}
```

Этот код проверяет каждый результат события и выполняет действия в зависимости от типа результата: ошибка, успех или неопределенность. Например, при успешном результате можно получить параметры обработчика и использовать их.

## Создание наследников класса Event

Для уменьшения объема кода можно создать наследников класса `Bitrix\Main\Event` для специфических событий. Например, `Bitrix\Main\Entity\Event` упрощает отправку событий, связанных с изменением сущностей.

## Класс EventManager

`EventManager` -- это класс для регистрации обработчиков событий. Он реализует паттерн Singleton, то есть у класса есть только один экземпляр, к которому можно обратиться через `getInstance()`.

Обработчики, зарегистрированные через `\Bitrix\Main\EventManager::AddEventHandler`, получают объект события `Bitrix\Main\Event` в качестве аргумента. Чтобы передавались старые аргументы, используйте `\Bitrix\Main\EventManager::addEventHandlerCompatible`. Это же касается `\Bitrix\Main\EventManager::registerEventHandler` и `\Bitrix\Main\EventManager::registerEventHandlerCompatible`.

### Примеры использования EventManager

Регистрация обработчика:

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();
$eventManager->registerEventHandlerCompatible("module", "event", "module2", "class", "function");
```

Для событий в DataManager:

```php
$eventManager = \Bitrix\Main\EventManager::getInstance();
$eventManager->registerEventHandler("module", "event", "module2", "class", "function");
```

Собственные обработчики в модулях:

Пример 1. Код создает событие, отправляет его, обрабатывает результаты и регистрирует обработчик для дальнейшего использования.

```php
$arMacros["PRODUCTS"] = "";
$basketId = "10";
$event = new \Bitrix\Main\Event("mymodule", "OnMacrosProductCreate", array($basketId));
$event->send();

if ($event->getResults()) {
    foreach ($event->getResults() as $eventResult) {
        if ($eventResult->getResultType() == \Bitrix\Main\EventResult::SUCCESS) {
            $arMacros["PRODUCTS"] = $eventResult->getParameters();
        }
    }
}

$eventManager = \Bitrix\Main\EventManager::getInstance();
$eventManager->addEventHandler("mymodule", "OnMacrosProductCreate", "OnMacrosProductCreate");

function OnMacrosProductCreate(\Bitrix\Main\Event $event) {
    $arParam = $event->getParameters();
    $basketId = $arParam[0];
    $result = new \Bitrix\Main\EventResult(1, $basketId);
    return $result;
}
```

Пример 2. Код показывает, как добавлять, удалять, регистрировать и отменять регистрацию обработчиков событий, а также как искать зарегистрированные обработчики для конкретного события.

```php
use Bitrix\Main\EventManager;

$handler = EventManager::getInstance()->addEventHandler(
    "main",
    "OnUserLoginExternal",
    array(
        "Intervolga\\Test\\EventHandlers\\Main",
        "onUserLoginExternal"
    )
);

EventManager::getInstance()->removeEventHandler(
    "main",
    "OnUserLoginExternal",
    $handler
);

EventManager::getInstance()->registerEventHandler(
    "main",
    "OnProlog",
    $this->MODULE_ID,
    "Intervolga\\Test\\EventHandlers",
    "onProlog"
);

EventManager::getInstance()->unRegisterEventHandler(
    "main",
    "OnProlog",
    $this->MODULE_ID,
    "Intervolga\\Test\\EventHandlers",
    "onProlog"
);

$handlers = EventManager::getInstance()->findEventHandlers("main", "OnProlog"); 
```

Добавление обработчика события `addEventHandler` используется, чтобы подключить обработчик к событию во время выполнения временно или в зависимости от определенных условий.

Регистрация обработчика события `registerEventHandler` применяется для постоянного подключения обработчика к событию, пока обработчик не будет отменен с помощью `unRegisterEventHandler`.

## Взаимодействие модулей через события

Событие -- это действие, при котором выполняются все обработчики этого события. Это позволяет модулям взаимодействовать через интерфейс событий, оставаясь независимыми.

### Схема работы с событиями

**Модуль, инициирующий событие**

1. Собирает все зарегистрированные обработчики с помощью [`GetModuleEvents`](http://dev.1c-bitrix.ru/api_help/main/functions/module/getmoduleevents.php).

2. Выполняет их по одному с помощью [`ExecuteModuleEvent`](http://dev.1c-bitrix.ru/api_help/main/functions/module/executemoduleevent.php), обрабатывая возвращаемые значения.

**Модуль, реагирующий на событие**

1. Регистрирует свой обработчик при инсталляции с помощью [`RegisterModuleDependences`](http://dev.1c-bitrix.ru/api_help/main/functions/module/registermoduledependences.php).

2. Имеет функцию-обработчик. Убедитесь, что функция-обработчик подключается в файле `/bitrix/modules/ID модуля/include.php`.

### Пример взаимодействия

Примером такого взаимодействия является работа модулей с модулем Поиска. Модуль Поиска не знает о данных других модулей, но предоставляет интерфейс для индексации. Модули регистрируют обработчик на событие [`OnReindex`](http://dev.1c-bitrix.ru/api_help/search/events/onreindex.php), возвращая данные для индексации.

### Примеры кода

Регистрация обработчика:

```php
RegisterModuleDependences(
    "init_module", "OnSomeEvent",
    "handler_module", "CMyModuleClass", "Handler"
);
```

Функция, генерирующая событие:

```php
function MyFunction() {
    $rsHandlers = GetModuleEvents("init_module", "OnSomeEvent");
    while ($arHandler = $rsHandlers->Fetch()) {
        if (!ExecuteModuleEvent($arHandler, $param1, $param2)) {
            return "I can't do it...";
        }
    }
    return "I have done it!";
}
```

Обработчик:

```php
class CMyModuleClass {
    function Handler($param1, $param2) {
        if ($param1 == "delete all") {
            return false;
        }
        return true;
    }
}
```
