---
title: Grid\Row\Action\Action — действие строки грида
description: Интерфейс Bitrix\Main\Grid\Row\Action\Action описывает действие строки грида — пункт контекстного меню и обработку запроса.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Grid\Row\Action`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Интерфейс `Action` описывает действие строки грида — пункт контекстного меню строки. Действие задает пункт меню методом [getControl](get-control.md) и обрабатывает запрос методом [processRequest](process-request.md).

Ядро реализует интерфейс в абстрактных классах `BaseAction` и `MenuAction` и в классе `SeparatorAction`. Класс `BaseAction` строит пункт меню из своих свойств. Наследник `BaseAction` задает текст пункта, идентификатор и обработку запроса.

Метод `prepareActions` наследника `Bitrix\Main\Grid\Row\Action\DataProvider` возвращает действия строк. Для каждой строки метод `prepareControls` провайдера собирает пункты меню из `getControl`. Объект `Bitrix\Main\Grid\Row\Rows` находит действие по идентификатору из запроса и вызывает `processRequest`.

Подробнее о меню строки — в разделе «Добавить действия» статьи [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md).

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getId](get-id.md) | Возвращает идентификатор действия | |
| [getControl](get-control.md) | Возвращает пункт контекстного меню для строки | |
| [processRequest](process-request.md) | Обрабатывает запрос к действию строки | |

## Смотрите также

- [Grid\Action\Action](../../../action/action/index.md)
- [Grid\Panel\Action\Action](../../../panel/action/action/index.md)
- [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md)
