---
title: Заменить аргументы действия Action::setArguments
description: Метод Action::setArguments заменяет аргументы, с которыми действие вызовет метод run.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::setArguments` заменяет аргументы, с которыми действие вызовет метод `run`. Метод заменяет весь список, а не отдельные значения. Метод нужен в фильтрах, которые меняют аргументы до выполнения действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function setArguments(array $arguments)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| arguments\* | `array` | Задает аргументы `run`. Ключи — имена аргументов. Метод передает значения в `run` по порядку элементов |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Engine\AutoWire\Binder`, а не действие.

## Исключения

| Исключение | Когда возникает |
| --- | --- |
| `Bitrix\Main\SystemException` | У класса действия нет метода `run` |

## Особенности

- Метод передает значения в `run` по порядку элементов массива и не учитывает ключи. Передавайте все аргументы в порядке объявления `run`. Чтобы изменить одно значение, получите массив методом [getArguments](get-arguments.md), измените его и передайте целиком.
- Метод не проверяет значения. Если значение не подходит под тип аргумента, PHP выбросит `TypeError` при вызове `run`.

## Примеры

**Пример.** Код меняет один аргумент действия и выполняет действие:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code, int $page = 1)
    {
        return $code . ', page ' . $page;
    }
}

$controller = new Controller();
$controller->setSourceParametersList([['code' => 'kg']]);

$action = new UnitViewAction('view', $controller);

$arguments = $action->getArguments();
$arguments['page'] = 2;
$action->setArguments($arguments);

echo $action->runWithSourceParametersList();
```

Код выведет `kg, page 2`.

## Смотрите также

- [Action::getArguments](get-arguments.md)
- [Action::runWithSourceParametersList](run-with-source-parameters-list.md)
