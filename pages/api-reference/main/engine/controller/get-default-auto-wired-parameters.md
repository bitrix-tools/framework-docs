---
title: Получить правила автоподстановки по умолчанию Controller::getDefaultAutoWiredParameters
description: Метод Controller::getDefaultAutoWiredParameters возвращает пустой массив. Ядро не вызывает метод.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getDefaultAutoWiredParameters` возвращает правила автоподстановки по умолчанию. Метод финальный, поэтому наследник не может его переопределить. Ядро не вызывает метод. Свои правила задавайте в [getAutoWiredParameters](get-auto-wired-parameters.md).

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getDefaultAutoWiredParameters()
```

## Возвращаемое значение

Метод всегда возвращает пустой массив.

## Примеры

**Пример.** Код проверяет правила по умолчанию:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

var_export((new UnitController())->getDefaultAutoWiredParameters());
```

Код выведет:

```text
array (
)
```

## Смотрите также

- [Controller::getAutoWiredParameters](get-auto-wired-parameters.md)
