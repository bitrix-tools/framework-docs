---
title: PageNavigation — постраничная навигация
description: Класс Bitrix\Main\UI\PageNavigation читает номер и размер страницы из адреса и рассчитывает смещение и лимит для выборки getList.
---

{% note info "" %}

**Пространство имен:** `Bitrix\Main\UI`

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.0.0

{% endnote %}

## Когда использовать

Класс `PageNavigation` разбивает список записей на страницы. Объект читает номер и размер страницы из адреса, рассчитывает смещение и лимит для запроса и строит ссылки на другие страницы. Компоненты `main.pagenavigation` и `main.ui.grid` принимают этот объект и выводят переключатель страниц.

Навигацию настраивают в четыре шага.

1. Конструктор [__construct](construct.md) создает объект с идентификатором, например `nav-units`. Идентификатор — имя параметра в адресе.
2. Методы [setPageSize](set-page-size.md), [setPageSizes](set-page-sizes.md) и [allowAllRecords](allow-all-records.md) задают настройки, метод [initFromUri](init-from-uri.md) читает параметры из адреса.
3. Методы [getOffset](get-offset.md) и [getLimit](get-limit.md) возвращают параметры `offset` и `limit` для `getList`.
4. Метод [setRecordCount](set-record-count.md) сохраняет общее число записей. Метод [getPageCount](get-page-count.md) считает по нему число страниц.

Класс поддерживает два формата параметров в адресе.

- Параметр запроса, например `/units/?nav-units=page-3-size-20`.
- Сегменты пути ЧПУ, например `/units/nav-units/page-3/size-20/`.

Значение `page-all` показывает все записи на одной странице, если это разрешил [allowAllRecords](allow-all-records.md).

Подробнее — в статьях [Постраничная навигация](../../../../cms-basics/page-navigation.md) и [Класс PageNavigation](../../../../cms-basics/page-navigation-class.md).

## Методы класса

| Метод | Описание | С версии |
| --- | --- | --- |
| [__construct](construct.md) | Создает объект навигации с идентификатором | |
| [initFromUri](init-from-uri.md) | Читает номер и размер страницы из адреса | |
| [setPageSize](set-page-size.md) | Задает размер страницы | |
| [getPageSize](get-page-size.md) | Возвращает размер страницы | |
| [setPageSizes](set-page-sizes.md) | Задает размеры страницы, которые можно выбрать в адресе | |
| [getPageSizes](get-page-sizes.md) | Возвращает допустимые размеры страницы | |
| [setCurrentPage](set-current-page.md) | Задает номер текущей страницы | |
| [getCurrentPage](get-current-page.md) | Возвращает номер текущей страницы | |
| [setRecordCount](set-record-count.md) | Задает общее число записей | |
| [getRecordCount](get-record-count.md) | Возвращает общее число записей | |
| [getPageCount](get-page-count.md) | Возвращает число страниц | |
| [getOffset](get-offset.md) | Возвращает смещение первой записи текущей страницы | |
| [getLimit](get-limit.md) | Возвращает лимит выборки — число записей на текущей странице | |
| [allowAllRecords](allow-all-records.md) | Разрешает показ всех записей на одной странице | |
| [allRecordsAllowed](all-records-allowed.md) | Проверяет, разрешен ли показ всех записей | |
| [allRecordsShown](all-records-shown.md) | Проверяет, показаны ли все записи на одной странице | |
| [getId](get-id.md) | Возвращает идентификатор навигации | |
| [addParams](add-params.md) | Добавляет параметры навигации в адрес | |
| [clearParams](clear-params.md) | Удаляет параметры навигации из адреса | |

## Наследники

| Класс | Назначение |
| --- | --- |
| `Bitrix\Main\UI\AdminPageNavigation` | Навигация на страницах административного раздела. Конструктор сам вызывает `initFromUri`. По умолчанию размеры страницы 10, 20, 50, 100, 200 и 500, показ всех записей разрешен |
| `Bitrix\Main\UI\ReversePageNavigation` | Навигация с обратной нумерацией страниц. Конструктор принимает идентификатор и число записей. По умолчанию открыта последняя страница |

## Смотрите также

- [Постраничная навигация](../../../../cms-basics/page-navigation.md)
- [Класс PageNavigation](../../../../cms-basics/page-navigation-class.md)
