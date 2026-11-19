---
title: Вернуть переадресацию Controller::redirectTo
description: Метод Controller::redirectTo возвращает ответ с переадресацией на адрес. Действие возвращает этот ответ вместо данных.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::redirectTo` возвращает ответ с переадресацией. Действие возвращает этот ответ, и клиент перейдет на адрес. Метод вызывает `redirectTo` текущего ответа приложения.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function redirectTo($url): HttpResponse
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| url\* | `string` или `Bitrix\Main\Web\Uri` | Задает адрес переадресации |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Engine\Response\Redirect`. Метод `getUrl` объекта возвращает адрес.

## Особенности

Переадресация работает для HTTP-запроса из браузера, например перехода по ссылке. Для вызова `BX.ajax.runAction` браузер получит ответ с кодом 302, а не JSON. Для AJAX верните адрес в данных и выполните переход в JavaScript.

## Примеры

**Пример.** Код выполняет действие с переадресацией:

```php
<?php
use Bitrix\Main\Engine\Controller;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function configureActions()
    {
        return ['open' => ['prefilters' => []]];
    }

    public function openAction()
    {
        return $this->redirectTo('/units/');
    }
}

$response = (new UnitController())->run('open', [[]]);

echo get_class($response) . ' ' . $response->getUrl();
```

Код выведет `Bitrix\Main\Engine\Response\Redirect /units/`.

## Смотрите также

- [HttpResponse::redirectTo](../../http-response/redirect-to.md)
