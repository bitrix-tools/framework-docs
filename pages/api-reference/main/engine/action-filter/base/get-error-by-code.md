---
title: Найти ошибку фильтра по коду Base::getErrorByCode
description: Метод ActionFilter\Base::getErrorByCode возвращает первую ошибку фильтра с заданным кодом или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Base::getErrorByCode` возвращает первую ошибку фильтра с заданным кодом. Метод входит в интерфейс `Bitrix\Main\Errorable` и вызывает [ErrorCollection::getErrorByCode](../../../error-collection/get-error-by-code.md).

Сигнатура метода в классе `Bitrix\Main\Engine\ActionFilter\Base`:

```php
final public function getErrorByCode($code)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| code\* | `int`, `string` | Задает код ошибки. Метод сравнивает коды строго, поэтому `'10'` и `10` — разные коды |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [Error](../../../error/index.md) или `null`, если ошибки с таким кодом нет.

## Примеры

**Пример.** Код вызывает обработчик фильтра [Csrf](../csrf/index.md) для запроса без токена и проверяет, добавил ли фильтр ошибку неверного токена:

```php
<?php
use Bitrix\Main\Engine\ActionFilter\Csrf;
use Bitrix\Main\Event;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$filter = new Csrf(returnNew: false);
$filter->onBeforeAction(new Event('main', 'OnDemoCheck'));

$error = $filter->getErrorByCode(Csrf::ERROR_INVALID_CSRF);
echo $error === null ? 'No error' : $error->getMessage();
```

Код выведет `Invalid csrf token`.

## Смотрите также

- [Base::getErrors](get-errors.md)
