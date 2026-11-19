---
title: Проверить, задан ли маршрут Application::hasCurrentRoute
description: Метод Application::hasCurrentRoute проверяет, совпал ли адрес текущего запроса с маршрутом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::hasCurrentRoute` проверяет, задан ли маршрут текущего запроса. Вызывайте метод перед [getCurrentRoute](get-current-route.md). Без маршрута `getCurrentRoute` выбрасывает `TypeError`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function hasCurrentRoute(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если маршрут задан, иначе `false`.

## Примеры

**Пример.** Код проверяет маршрут в консольном скрипте:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getInstance()->hasCurrentRoute());
```

Код выведет `bool(false)`.

## Смотрите также

- [Application::getCurrentRoute](get-current-route.md)
- [Application::setCurrentRoute](set-current-route.md)
