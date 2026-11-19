---
title: Задать имя cookie сессии SessionInterface::setName
description: Метод SessionInterface::setName задает имя сессии. Вызывать метод нужно до запуска сессии.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::setName` задает имя сессии, то есть имя cookie с идентификатором. Вызывайте метод до [start](start.md). Имя по умолчанию задает параметр `session.name` в `php.ini`, поэтому прикладному коду метод нужен редко.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function setName($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя сессии |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод ничего не возвращает.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `\RuntimeException` | Класс `Session`, сессия PHP уже активна |
| `Bitrix\Main\NotSupportedException` | Класс `KernelSession` не поддерживает метод |

## Примеры

**Пример.** Код пытается сменить имя запущенной сессии:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

try
{
    Application::getInstance()->getSession()->setName('UNITS_SESSID');
}
catch (\RuntimeException $e)
{
    echo $e->getMessage();
}
```

Код выведет `Could not change the name of an active session`.

## Смотрите также

- [SessionInterface::getName](get-name.md)
