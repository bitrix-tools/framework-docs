---
title: Получить ошибку по коду Controller::getErrorByCode
description: Метод Controller::getErrorByCode возвращает первую ошибку контроллера с указанным кодом.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::getErrorByCode` возвращает ошибку с указанным кодом. Метод нужен, чтобы отличить конкретную ошибку, например ошибку проверки CSRF-токена `invalid_csrf`.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
final public function getErrorByCode($code)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `string` или `int` | Задает код ошибки |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Error` или `null`, если ошибки с таким кодом нет.

## Примеры

**Пример.** Код ищет ошибку фильтра по коду:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function listAction(): array
    {
        return [];
    }
}

$controller = new UnitController();
$controller->run('list', [[]]);

echo $controller->getErrorByCode('invalid_authentication') ? 'auth required' : 'ok';
```

Код выведет `auth required`. Консольный скрипт работает без авторизации, поэтому фильтр `Authentication` не пропускает действие.

## Смотрите также

- [Controller::getErrors](get-errors.md)
