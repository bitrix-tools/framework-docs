---
title: Прочитать параметры навигации из адреса PageNavigation::initFromUri
description: Метод PageNavigation::initFromUri читает номер и размер страницы из параметра запроса или из сегментов пути ЧПУ.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::initFromUri` читает номер и размер страницы из адреса текущего запроса. Вызывайте метод после настройки объекта. Методы [setPageSizes](set-page-sizes.md) и [allowAllRecords](allow-all-records.md) влияют на разбор адреса.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function initFromUri()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод ищет параметр запроса с именем идентификатора, например `?nav-units=page-3-size-20`. Если параметра нет, поиск идет по сегментам пути, например `/nav-units/page-3/size-20/`.

Значения из адреса применяются с ограничениями:

- размер страницы — только если он есть в списке [setPageSizes](set-page-sizes.md), иначе остается прежний размер,
- значение `page-all` — только если [allowAllRecords](allow-all-records.md) разрешил показ всех записей,
- номер страницы меньше 1 игнорируется.

Если число записей уже задано через [setRecordCount](set-record-count.md), номер страницы не превышает число страниц. При числе записей 0 номер становится 0, а [getOffset](get-offset.md) возвращает отрицательное смещение. Чтобы этого избежать, задавайте число записей после `initFromUri` или проверяйте, что оно больше нуля.

## Примеры

**Пример.** Код имитирует адрес `?nav-units=page-3-size-50` и читает из него параметры:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

// На реальной странице параметр приходит из адреса
Context::getCurrent()->getRequest()->modifyByQueryString('nav-units=page-3-size-50');

$nav = new PageNavigation('nav-units');
$nav->setPageSizes([20, 50, 100]);
$nav->initFromUri();

echo $nav->getCurrentPage() . ' ' . $nav->getPageSize() . ' ' . $nav->getOffset();
```

Код выведет `3 50 100`.

## Смотрите также

- [PageNavigation::setPageSizes](set-page-sizes.md)
- [PageNavigation::addParams](add-params.md)
