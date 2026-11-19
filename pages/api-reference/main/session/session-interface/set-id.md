---
title: Задать идентификатор сессии SessionInterface::setId
description: Метод SessionInterface::setId задает идентификатор сессии. Вызывать метод нужно до запуска сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::setId` задает идентификатор, с которым запустится сессия. Вызывайте метод до [start](start.md). Чтобы сменить идентификатор активной сессии и сохранить данные, используйте [regenerateId](regenerate-id.md).

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function setId($id);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| id\* | `string` | Задает идентификатор сессии |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\RuntimeException` | Класс `Session`, сессия PHP уже активна |
| `Bitrix\Main\NotSupportedException` | Класс `KernelSession` не поддерживает метод |

## Примеры

**Пример.** Код пытается сменить идентификатор запущенной сессии:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();

try
{
    $session->setId('units' . bin2hex(random_bytes(8)));
}
catch (\RuntimeException $e)
{
    echo $e->getMessage();
}
```

Код выведет `Could not change the ID of an active session`.

## Смотрите также

- [SessionInterface::getId](get-id.md)
- [SessionInterface::regenerateId](regenerate-id.md)
