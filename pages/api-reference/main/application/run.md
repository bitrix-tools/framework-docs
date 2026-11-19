---
title: Выполнить контроллер Application::run
description: Метод Application::run выполняет контроллер и действие запроса и отправляет ответ. В базовом классе метод ничего не делает, HttpApplication обрабатывает AJAX-запросы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::run` выполняет контроллер и действие, которые указаны в запросе, и отправляет ответ. В базовом классе метод пустой. `HttpApplication` находит контроллер по параметру `action` и выполняет его — так работает файл `/bitrix/services/main/ajax.php`, который обрабатывает вызовы `BX.ajax.runAction`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function run()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

- В `HttpApplication` метод отправляет ответ и завершает скрипт методом [end](end.md). Код после вызова не выполнится.
- Если метод не нашел контроллер, клиент получит ответ JSON со статусом `error`.
- Вызывать метод в коде приложения не нужно. Для своего обработчика запросов используйте контроллеры и маршруты.

## Примеры

**Пример.** Код вызывает метод без параметра `action` в запросе:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

Application::getInstance()->run();

echo 'never';
```

Код выведет `{"status":"error","data":null,"errors":[{"message":"Internal server error.","code":22002,"customData":null}]}`. Код не выведет строку `never`.

В режиме отладки и в более ранних версиях, например `main` 26.150.0, вместо `Internal server error.` в ответе стоит текст исключения `Could not find description of  in Bitrix\\Main\\Engine\\DefaultController`. Подробнее — на странице [Controller::run](../engine/controller/run.md).

## Смотрите также

- [Контроллеры](../../../framework/controllers.md)
- [Application::end](end.md)
