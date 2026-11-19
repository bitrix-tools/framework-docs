---
title: Grid\Panel\Action\Action — действие панели грида
description: Интерфейс Bitrix\Main\Grid\Panel\Action\Action описывает групповое действие панели грида — элемент управления и обработку запроса для выбранных строк.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Grid\Panel\Action`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Интерфейс `Action` описывает действие панели грида — кнопку или другой элемент над списком, который работает с выбранными строками. Действие задает элемент управления методом [getControl](get-control.md) и обрабатывает запрос методом [processRequest](process-request.md).

Ядро реализует интерфейс в абстрактных классах `EditAction`, `RemoveAction`, `GroupAction` и в классе `ForAllCheckboxAction`. Для своего действия наследуйте подходящий абстрактный класс или реализуйте интерфейс.

Метод `prepareActions` наследника `Bitrix\Main\Grid\Panel\Action\DataProvider` возвращает действия панели. Метод `prepareControls` провайдера собирает элементы управления из `getControl`. Панель `Bitrix\Main\Grid\Panel\Panel` находит действие по идентификатору из запроса и вызывает `processRequest`. Если действия с таким идентификатором нет, панель вызывает действие с идентификатором `GroupAction::getId()`.

Подробнее о гриде — в разделе «Использовать серверный слой Grid» статьи [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md).

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getId](get-id.md) | Возвращает идентификатор действия | |
| [getControl](get-control.md) | Возвращает описание элемента управления на панели | |
| [processRequest](process-request.md) | Обрабатывает запрос к действию для выбранных строк | |

## Смотрите также

- [Grid\Action\Action](../../../action/action/index.md)
- [Grid\Row\Action\Action](../../../row/action/action/index.md)
- [Грид main.ui.grid](../../../../../../ui/main-ui-grid.md)
