---
title: Получить идентификатор действия грида Action::getId
description: Метод Grid\Action\Action::getId возвращает идентификатор действия грида, по которому грид находит действие для запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getId` возвращает идентификатор действия. Грид сравнивает его со значением параметра `grid_action` в запросе. Метод статический, поэтому идентификатор одинаков у всех объектов класса.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Action\Action`:

```php
public static function getId(): string;
```

## Возвращаемое значение

Метод возвращает строку с идентификатором действия. Если два действия грида возвращают один идентификатор, грид использует последнее из списка `getActions`.

## Примеры

**Пример.** Код реализует действие грида и выводит его идентификатор:

```php
<?php
use Bitrix\Main\Grid\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoRefreshAction implements Action
{
    public static function getId(): string
    {
        return 'demo_refresh';
    }

    public function processRequest(HttpRequest $request): ?Result
    {
        return new Result();
    }
}

echo DemoRefreshAction::getId();
```

Код выведет `demo_refresh`.

## Смотрите также

- [Action::processRequest](process-request.md)
