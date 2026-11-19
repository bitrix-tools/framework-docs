---
title: Получить маршрут запроса Application::getCurrentRoute
description: Метод Application::getCurrentRoute возвращает маршрут, который совпал с адресом текущего запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getCurrentRoute` возвращает [маршрут](../routing/route/index.md), который совпал с адресом текущего запроса. Файл `/bitrix/modules/main/include/routing_index.php` задает маршрут, когда находит его в маршрутизаторе. Через маршрут контроллер получает параметры из адреса, например `{id}`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getCurrentRoute(): Route
```

## Возвращаемое значение

Метод возвращает объект [Route](../routing/route/index.md).

## Особенности

Если маршрут не задан, например на странице без маршрутизации, метод выбрасывает `TypeError`. Перед вызовом проверьте маршрут методом [hasCurrentRoute](has-current-route.md).

## Примеры

**Пример.** Код читает адрес маршрута, если он задан:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();

echo $application->hasCurrentRoute() ? $application->getCurrentRoute()->getUri() : 'no route';
```

На странице с маршрутом `/units/{id}/` код выведет `/units/{id}/`. Из консоли код выведет `no route`.

## Смотрите также

- [Application::hasCurrentRoute](has-current-route.md)
- [Маршрутизация](../../../framework/routing.md)
