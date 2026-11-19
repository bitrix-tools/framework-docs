---
title: Изменить ответ перед отправкой Controller::finalizeResponse
description: Метод Controller::finalizeResponse получает ответ перед отправкой клиенту. Наследник переопределяет его, чтобы добавить заголовки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Controller::finalizeResponse` получает готовый ответ перед отправкой клиенту. Приложение `HttpApplication` вызывает метод последним, после действия и постфильтров. Наследник переопределяет метод, например чтобы добавить заголовок ко всем ответам контроллера.

Сигнатура метода в классе `Bitrix\Main\Engine\Controller`:

```php
public function finalizeResponse(Response $response)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| response\* | `Bitrix\Main\Response` | Задает ответ, который контроллер отправит клиенту |

## Возвращаемое значение

Метод ничего не возвращает. Базовый класс ничего не делает.

## Примеры

**Пример.** Код добавляет заголовок к ответу:

```php
<?php
use Bitrix\Main\Engine\Controller;
use Bitrix\Main\HttpResponse;
use Bitrix\Main\Response;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

class UnitController extends Controller
{
    public function finalizeResponse(Response $response)
    {
        if ($response instanceof HttpResponse)
        {
            $response->addHeader('X-Units-Api', '1');
        }
    }
}

$response = new HttpResponse();
(new UnitController())->finalizeResponse($response);

echo $response->getHeaders()->get('X-Units-Api');
```

Код выведет `1`.

## Смотрите также

- [HttpResponse](../../http-response/index.md)
