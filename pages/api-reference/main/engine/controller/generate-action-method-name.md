---
title: Получить имя метода действия Controller::generateActionMethodName
description: Метод Controller::generateActionMethodName возвращает имя метода действия — имя действия с суффиксом Action.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::generateActionMethodName` возвращает имя метода действия — имя действия с суффиксом `Action`. Метод [run](run.md) ищет метод с этим именем.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function generateActionMethodName($action): string
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| action\* | `string` | Задает имя действия |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает строку. Метод не меняет регистр имени. PHP вызывает методы без учета регистра, поэтому действие `getlist` найдет метод `getListAction`.

## Примеры

**Пример.** Код выводит имя метода действия:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

echo (new UnitController())->generateActionMethodName('getList');
```

Код выведет `getListAction`.

## Смотрите также

- [Controller::listNameActions](list-name-actions.md)
