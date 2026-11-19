---
title: Получить идентификатор действия панели Action::getId
description: Метод Grid\Panel\Action\Action::getId возвращает идентификатор действия панели грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getId` возвращает идентификатор действия панели. Панель сравнивает его с идентификатором действия из запроса. Метод статический, поэтому идентификатор одинаков у всех объектов класса.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Panel\Action\Action`:

```php
public static function getId(): string;
```

## Возвращаемое значение

Метод возвращает строку с идентификатором действия. Если два действия возвращают один идентификатор, панель использует первое из них.

## Примеры

**Пример.** Код реализует действие панели `demo_archive` и выводит его идентификатор:

```php
<?php
use Bitrix\Main\Filter\Filter;
use Bitrix\Main\Grid\Panel\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoArchiveAction implements Action
{
    public static function getId(): string
    {
        return 'demo_archive';
    }

    public function processRequest(HttpRequest $request, bool $isSelectedAllRows, ?Filter $filter): ?Result
    {
        return new Result();
    }

    public function getControl(): ?array
    {
        return null;
    }
}

echo DemoArchiveAction::getId();
```

Код выведет `demo_archive`.

## Смотрите также

- [Action::getControl](get-control.md)
- [Action::processRequest](process-request.md)
