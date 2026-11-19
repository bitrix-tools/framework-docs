---
title: Получить идентификатор действия строки Action::getId
description: Метод Grid\Row\Action\Action::getId возвращает идентификатор действия строки грида или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getId` возвращает идентификатор действия строки. Объект `Rows` сравнивает его с идентификатором действия из запроса. Метод статический, поэтому идентификатор одинаков у всех объектов класса.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Row\Action\Action`:

```php
public static function getId(): ?string;
```

## Возвращаемое значение

Метод возвращает строку с идентификатором действия или `null`. Например, разделитель меню `SeparatorAction` возвращает `null`, потому что у него нет обработчика запроса.

Если два действия возвращают один идентификатор, объект `Rows` использует первое из них.

## Примеры

**Пример.** Код реализует действие строки и выводит его идентификатор:

```php
<?php
use Bitrix\Main\Grid\Row\Action\Action;
use Bitrix\Main\HttpRequest;
use Bitrix\Main\Result;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

final class DemoOpenUnitAction implements Action
{
    public static function getId(): ?string
    {
        return 'demo_open_unit';
    }

    public function processRequest(HttpRequest $request): ?Result
    {
        return null;
    }

    public function getControl(array $rawFields): ?array
    {
        return null;
    }
}

echo DemoOpenUnitAction::getId();
```

Код выведет `demo_open_unit`.

## Смотрите также

- [Action::getControl](get-control.md)
