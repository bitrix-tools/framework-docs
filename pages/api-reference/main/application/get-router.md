---
title: Получить маршрутизатор Application::getRouter
description: Метод Application::getRouter возвращает маршрутизатор с маршрутами из файлов /local/routes/ и /bitrix/routes/. При первом вызове метод загружает маршруты.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getRouter` возвращает [маршрутизатор](../routing/router/index.md). При первом вызове метод создает его и загружает маршруты.

Метод загружает файлы маршрутов в таком порядке.

1. Файлы из ключа `routing.config` файла `/bitrix/.settings.php`. Метод ищет каждый файл в `/local/routes/` и `/bitrix/routes/` и подключает оба, если они есть.
2. Системные файлы из ключа `routing.config` файла `/bitrix/routes/.settings.php`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getRouter(): Router
```

## Возвращаемое значение

Метод возвращает объект [Router](../routing/router/index.md).

## Примеры

**Пример.** Код считает загруженные маршруты:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo count(Application::getInstance()->getRouter()->getRoutes());
```

Код выведет число маршрутов. На сайте без файлов маршрутов код выведет `0`.

## Смотрите также

- [Маршрутизация](../../../framework/routing.md)
- [Router](../routing/router/index.md)
- [Application::setRouter](set-router.md)
