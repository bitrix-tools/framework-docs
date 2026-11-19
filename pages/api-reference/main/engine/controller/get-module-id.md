---
title: Получить модуль контроллера Controller::getModuleId
description: Метод Controller::getModuleId определяет модуль контроллера по пути к файлу его класса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getModuleId` определяет модуль контроллера по пути к файлу класса, например `/bitrix/modules/main/lib/...` — модуль `main`. По модулю ядро строит имя действия для адреса AJAX-запроса.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getModuleId()
```

## Возвращаемое значение

Метод возвращает идентификатор модуля — имя каталога после `modules` в пути к файлу. Для класса вне каталога модуля метод вернет неверный идентификатор.

## Примеры

**Пример.** Код определяет модуль контроллера ядра:

```php
<?php
use Bitrix\Main\Controller\UserOption;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new UserOption())->getModuleId();
```

Код выведет `main`.

## Смотрите также

- [Controller::getActionUri](get-action-uri.md)
