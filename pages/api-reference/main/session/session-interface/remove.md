---
title: Удалить значение по ключу SessionInterface::remove
description: Метод SessionInterface::remove удаляет значение сессии по ключу.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::remove` удаляет значение сессии по ключу. Вызов `unset($session['key'])` выполняет то же действие.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function remove($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает ключ. Если ключа нет, метод ничего не делает |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код удаляет значение и проверяет ключ:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'list');
$session->remove('units_view');

var_dump($session->has('units_view'));
```

Код выведет `bool(false)`.

## Смотрите также

- [SessionInterface::clear](clear.md)
