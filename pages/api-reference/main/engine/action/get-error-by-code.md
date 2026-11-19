---
title: Получить ошибку по коду Action::getErrorByCode
description: Метод Action::getErrorByCode возвращает ошибку действия с указанным кодом или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getErrorByCode` возвращает ошибку действия с указанным кодом. Метод вызывает [ErrorCollection::getErrorByCode](../../error-collection/get-error-by-code.md) для списка ошибок действия.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
final public function getErrorByCode($code)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` или `int` | Задает код ошибки |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает объект [Error](../../error/index.md) или `null`, если ошибки с таким кодом нет.

## Примеры

**Пример.** Код выполняет действие и проверяет, есть ли ошибка с кодом `UNKNOWN_UNIT`:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitViewAction extends Action
{
    public function run(string $code)
    {
        if ($code !== 'kg')
        {
            $this->addError(new Error('Unknown unit', 'UNKNOWN_UNIT'));
        }

        return null;
    }
}

$controller = (new Controller())->setSourceParametersList([['code' => 'lb']]);
$action = new UnitViewAction('view', $controller);
$action->runWithSourceParametersList();

echo $action->getErrorByCode('UNKNOWN_UNIT')?->getMessage() ?? 'No error';
```

Код выведет `Unknown unit`.

## Смотрите также

- [Action::getErrors](get-errors.md)
- [ErrorCollection::getErrorByCode](../../error-collection/get-error-by-code.md)
