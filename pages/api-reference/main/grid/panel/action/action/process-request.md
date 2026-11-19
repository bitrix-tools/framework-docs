---
title: Обработать запрос к действию панели Action::processRequest
description: Метод Grid\Panel\Action\Action::processRequest обрабатывает запрос к действию панели для выбранных строк или для всех строк по фильтру.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::processRequest` выполняет действие панели для выбранных строк. Панель вызывает его, когда идентификатор действия из запроса совпадает со значением [getId](get-id.md), и передает в метод фильтр грида. Перед вызовом панель проверяет CSRF-токен.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Panel\Action\Action`:

```php
public function processRequest(HttpRequest $request, bool $isSelectedAllRows, ?Filter $filter): ?Result;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| request\* | `Bitrix\Main\HttpRequest` | Задает HTTP-запрос с параметрами действия и выбранными строками |
| isSelectedAllRows\* | `bool` | Указывает, отметил ли пользователь флажок «для всех» на панели. Тогда действие обрабатывает все строки по фильтру, а не только выбранные |
| filter\* | `Bitrix\Main\Filter\Filter`, `null` | Задает фильтр грида. Если `isSelectedAllRows` равен `true`, получите список строк по этому фильтру |

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Result` или `null`, если у действия нет результата. Если метод вернул `Result`, панель создает из него ответ `GridResponse`, и грид не обрабатывает действия строк в этом запросе.

## Особенности

Значение `isSelectedAllRows` панель берет из параметра `action_all_rows_<идентификатор грида>` POST-запроса. Если панель вызывает действие с идентификатором `GroupAction::getId()` как запасное, она берет значение из параметра `controls[action_all_rows_<идентификатор грида>]`.

## Примеры

**Пример.** Действие получает идентификаторы строк из параметра `ID` запроса и возвращает их число. Код передает в действие две выбранные строки и выводит результат:

```php
<?php
use Bitrix\Main\Filter\Filter;
use Bitrix\Main\Grid\Panel\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;
use Bitrix\Main\Server;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoArchiveAction implements Action
{
    public static function getId(): string
    {
        return 'demo_archive';
    }

    public function processRequest(HttpRequest $request, bool $isSelectedAllRows, ?Filter $filter): ?Result
    {
        $ids = array_map('intval', (array)$request->getPost('ID'));

        // здесь код обрабатывает строки с идентификаторами $ids

        return (new Result())->setData(['count' => count($ids)]);
    }

    public function getControl(): ?array
    {
        return null;
    }
}

$request = new HttpRequest(new Server(['REQUEST_METHOD' => 'POST']), [], ['ID' => ['5', '7']], [], []);

$result = (new DemoArchiveAction())->processRequest($request, false, null);

echo $result->getData()['count'];
```

Код выведет `2`.

## Смотрите также

- [Action::getControl](get-control.md)
- [Action::getId](get-id.md)
