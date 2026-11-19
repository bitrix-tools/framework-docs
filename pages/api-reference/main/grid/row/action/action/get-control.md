---
title: Получить пункт меню строки Action::getControl
description: Метод Grid\Row\Action\Action::getControl возвращает пункт контекстного меню для строки грида по ее данным.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getControl` возвращает пункт контекстного меню для конкретной строки. По данным строки действие может изменить пункт или скрыть его.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Row\Action\Action`:

```php
public function getControl(array $rawFields): ?array;
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| rawFields\* | `array` | Задает исходные данные строки — значения полей до того, как грид подготовит их к выводу |

## Возвращаемое значение

Метод возвращает массив с описанием пункта меню или `null`, если пункт для этой строки не нужен. Провайдер пропускает действие, у которого метод вернул `null`.

Класс `BaseAction` возвращает массив с ключом `TEXT` и, если свойства заданы, ключами `DEFAULT`, `ICONCLASS`, `TITLE`, `HREF` и `ONCLICK`.

## Примеры

**Пример.** Действие показывает пункт `Open` только для активной строки и подставляет идентификатор строки в адрес:

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
        if (($rawFields['ACTIVE'] ?? 'N') !== 'Y')
        {
            return null;
        }

        return [
            'TEXT' => 'Open',
            'HREF' => '/units/' . (int)$rawFields['ID'] . '/',
        ];
    }
}

$action = new DemoOpenUnitAction();

print_r($action->getControl(['ID' => 5, 'ACTIVE' => 'Y']));
var_dump($action->getControl(['ID' => 7, 'ACTIVE' => 'N']));
```

Код выведет массив с ключами `TEXT` и `HREF`, где `HREF` равен `/units/5/`, затем `NULL`.

## Смотрите также

- [Action::processRequest](process-request.md)
- [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md)
