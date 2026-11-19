---
title: Grid\Action\Action — действие грида
description: Интерфейс Bitrix\Main\Grid\Action\Action описывает действие самого грида с идентификатором и обработкой запроса, например переход на страницу.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\Grid\Action`

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

## Когда использовать

Интерфейс `Action` описывает действие самого грида, а не его строк или панели. Ядро реализует интерфейс в классах `PaginationAction` и `CalculateTotalCountAction`.

Класс грида `Bitrix\Main\Grid\Grid` возвращает свои действия из защищенного метода `getActions`. Метод `Grid::processRequest` находит действие по значению параметра `grid_action` в запросе и вызывает его метод [processRequest](process-request.md). Перед этим грид проверяет CSRF-токен и совпадение параметра `grid_id` с идентификатором грида.

Действия строк описывает интерфейс [Grid\Row\Action\Action](../../row/action/action/index.md), действия панели — [Grid\Panel\Action\Action](../../panel/action/action/index.md).

Подробнее о гриде — в разделе «Использовать серверный слой Grid» статьи [Грид main.ui.grid](../../../../../ui/main-ui-grid.md).

## Методы интерфейса

| Метод | Описание | С версии |
| --- | --- | --- |
| [getId](get-id.md) | Возвращает идентификатор действия | |
| [processRequest](process-request.md) | Обрабатывает запрос к действию | |

## Смотрите также

- [Grid\Panel\Action\Action](../../panel/action/action/index.md)
- [Grid\Row\Action\Action](../../row/action/action/index.md)
- [Грид main.ui.grid](../../../../../ui/main-ui-grid.md)
