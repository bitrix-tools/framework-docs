---
title: Получить элемент управления панели Action::getControl
description: Метод Grid\Panel\Action\Action::getControl возвращает описание элемента управления, который действие добавляет на панель грида.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Action::getControl` возвращает описание элемента управления на панели грида, например кнопки. Метод `prepareControls` провайдера действий панели собирает описания всех действий в параметр панели.

Сигнатура метода в интерфейсе `Bitrix\Main\Grid\Panel\Action\Action`:

```php
public function getControl(): ?array;
```

## Возвращаемое значение

Метод возвращает массив с описанием элемента управления или `null`, если действию не нужен элемент на панели. Провайдер пропускает действие, у которого метод вернул `null`.

Массив имеет тот же формат, что элемент группы `ITEMS` в параметре `ACTION_PANEL` компонента `bitrix:main.ui.grid`. Готовые описания элементов строит класс `Bitrix\Main\Grid\Panel\Snippet`.

## Примеры

**Пример.** Действие описывает кнопку с текстом `Archive` и вызовом JavaScript-функции:

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
        return null;
    }

    public function getControl(): ?array
    {
        return [
            'TYPE' => 'BUTTON',
            'ID' => self::getId(),
            'TEXT' => 'Archive',
            'ONCHANGE' => [
                [
                    'ACTION' => 'CALLBACK',
                    'DATA' => [
                        ['JS' => 'BX.Demo.archiveSelected();'],
                    ],
                ],
            ],
        ];
    }
}

$control = (new DemoArchiveAction())->getControl();

echo $control['TYPE'] . ' ' . $control['TEXT'];
```

Код выведет `BUTTON Archive`.

## Смотрите также

- [Action::processRequest](process-request.md)
- [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md)
