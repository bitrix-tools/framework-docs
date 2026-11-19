---
title: Обработать запрос к действию строки Action::processRequest
description: Метод Grid\Row\Action\Action::processRequest обрабатывает HTTP-запрос к действию строки грида и возвращает результат или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::processRequest` выполняет действие строки по HTTP-запросу. Объект `Rows` вызывает его, когда идентификатор действия из запроса совпадает со значением [getId](get-id.md). Перед вызовом объект проверяет CSRF-токен.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Row\Action\Action`:

```php
public function processRequest(HttpRequest $request): ?Result;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\HttpRequest` | Задает HTTP-запрос с параметрами действия, например идентификатором строки |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Result` или `null`, если у действия нет обработчика или результата. Если метод вернул `Result`, объект `Rows` создает из него ответ `GridResponse`.

## Примеры

**Пример.** Действие проверяет идентификатор строки из параметра `id` запроса и возвращает ошибку для пустого значения:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Grid\Row\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;
use Bitrix\Main\Server;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoArchiveUnitAction implements Action
{
    public static function getId(): ?string
    {
        return 'demo_archive_unit';
    }

    public function processRequest(HttpRequest $request): ?Result
    {
        $result = new Result();

        $id = (int)$request->getPost('id');
        if ($id <= 0)
        {
            $result->addError(new Error('Row id is required'));
        }

        return $result;
    }

    public function getControl(array $rawFields): ?array
    {
        return null;
    }
}

$request = new HttpRequest(new Server(['REQUEST_METHOD' => 'POST']), [], [], [], []);

$result = (new DemoArchiveUnitAction())->processRequest($request);

echo implode(', ', $result->getErrorMessages());
```

Код выведет `Row id is required`.

## Смотрите также

- [Action::getId](get-id.md)
