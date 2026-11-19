---
title: Перевести ключи в camelCase Controller::convertKeysToCamelCase
description: Метод Controller::convertKeysToCamelCase переводит ключи массива из формата UPPER_SNAKE в camelCase на всех уровнях вложенности.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::convertKeysToCamelCase` переводит ключи массива в camelCase, например `UNIT_LIST` в `unitList`. Метод нужен, чтобы передать данные ORM в JavaScript с ключами в привычном формате.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function convertKeysToCamelCase($data)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| data\* | `mixed` | Задает данные. Метод переводит ключи массивов на всех уровнях вложенности |

## Возвращаемое значение

Метод возвращает данные с новыми ключами и не меняет значения массивов. Строку метод переводит в camelCase целиком, объекты возвращает без изменений.

## Примеры

**Пример.** Код переводит ключи строки ORM:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
}

$data = (new UnitController())->convertKeysToCamelCase([
    'ID' => 1,
    'UNIT_LIST' => ['SHORT_NAME' => 'kg'],
]);

echo json_encode($data);
```

Код выведет `{"id":1,"unitList":{"shortName":"kg"}}`.

## Смотрите также

- [Action::convertKeysToCamelCase](../action/convert-keys-to-camel-case.md)
