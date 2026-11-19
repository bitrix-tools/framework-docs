---
title: Обработать запрос к действию грида Action::processRequest
description: Метод Grid\Action\Action::processRequest обрабатывает HTTP-запрос к действию грида и возвращает результат или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::processRequest` выполняет действие грида по HTTP-запросу. Метод `Grid::processRequest` вызывает его, когда параметр `grid_action` запроса совпадает со значением [getId](get-id.md).

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Action\Action`:

```php
public function processRequest(HttpRequest $request): ?Result;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\HttpRequest` | Задает HTTP-запрос с параметрами действия |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Result` или `null`, если у действия нет результата.

Если метод вернул `Result`, грид создает из него ответ `GridResponse` и при необходимости отправляет его. Действия панели и строк грид в этом запросе не выполняет. Если метод вернул `null`, грид переходит к действиям панели и строк.

## Примеры

**Пример.** Действие читает параметр `status` из запроса и возвращает ошибку для неизвестного значения:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Grid\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;
use Bitrix\Main\Server;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoStatusFilterAction implements Action
{
    public static function getId(): string
    {
        return 'demo_status_filter';
    }

    public function processRequest(HttpRequest $request): ?Result
    {
        $result = new Result();

        $status = (string)$request->getPost('status');
        if (!in_array($status, ['active', 'archived'], true))
        {
            $result->addError(new Error('Unknown status'));
        }

        return $result;
    }
}

$request = new HttpRequest(new Server(['REQUEST_METHOD' => 'POST']), [], ['status' => 'deleted'], [], []);

$result = (new DemoStatusFilterAction())->processRequest($request);

echo implode(', ', $result->getErrorMessages());
```

Код выведет `Unknown status`.

## Смотрите также

- [Action::getId](get-id.md)
