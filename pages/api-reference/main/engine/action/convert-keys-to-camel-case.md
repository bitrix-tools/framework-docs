---
title: Перевести ключи массива в camelCase Action::convertKeysToCamelCase
description: Метод Action::convertKeysToCamelCase переводит ключи массива из формата UNIT_CODE в формат unitCode, в том числе во вложенных массивах.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::convertKeysToCamelCase` переводит ключи массива в camelCase, например `UNIT_CODE` в `unitCode`. Метод вызывает одноименный метод контроллера, а тот — конвертер `Bitrix\Main\Engine\Response\Converter` контроллера.

Метод нужен, чтобы вернуть в JSON-ответе данные из ORM или классического API с ключами в стиле JavaScript.

Сигнатура метода в классе `Bitrix\Main\Engine\Action`:

```php
public function convertKeysToCamelCase($data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `mixed` | Задает данные, например массив |

## Возвращаемое значение

Метод возвращает данные с измененными ключами. По умолчанию конвертер контроллера меняет ключи и во вложенных массивах.

## Примеры

**Пример.** Код переводит ключи вложенного массива:

```php
<?php
use Bitrix\Main\Engine\Action;
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitListAction extends Action
{
    public function run()
    {
        return $this->convertKeysToCamelCase([
            'UNIT_CODE' => 'kg',
            'ITEMS' => ['SORT_ORDER' => 10],
        ]);
    }
}

$action = new UnitListAction('list', (new Controller())->setSourceParametersList([[]]));

var_export($action->runWithSourceParametersList());
```

Код выведет:

```text
array (
  'unitCode' => 'kg',
  'items' => 
  array (
    'sortOrder' => 10,
  ),
)
```

## Смотрите также

- [Запрос и ответ](../../../../framework/request-response.md#converter)
