---
title: Получить запрос Controller::getRequest
description: Метод Controller::getRequest возвращает запрос, который обрабатывает контроллер.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getRequest` возвращает запрос, который обрабатывает контроллер. Конструктор получает запрос аргументом. По умолчанию это текущий запрос из контекста.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getRequest()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\HttpRequest` или другой `Bitrix\Main\Request`, который получил конструктор.

## Особенности

Ядро само подбирает аргументы действия из параметров запроса по именам. Читайте запрос напрямую, только когда нужны данные вне аргументов, например заголовки или файлы.

## Примеры

**Пример.** Код читает класс запроса контроллера:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

echo get_class((new UnitController())->getRequest());
```

Код выведет `Bitrix\Main\HttpRequest`.

## Смотрите также

- [Controller::getSourceParametersList](get-source-parameters-list.md)
