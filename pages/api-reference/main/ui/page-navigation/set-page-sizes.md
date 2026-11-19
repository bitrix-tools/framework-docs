---
title: Задать допустимые размеры страницы PageNavigation::setPageSizes
description: Метод PageNavigation::setPageSizes задает размеры страницы, которые пользователь может выбрать через адрес.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::setPageSizes` задает размеры страницы, которые пользователь может выбрать. Метод [initFromUri](init-from-uri.md) применяет размер из адреса, только если он есть в этом списке. Шаблон `admin` компонента `main.pagenavigation` выводит список для выбора. Если размеров больше одного, компонент добавляет размер страницы в ссылки.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function setPageSizes(array $sizes)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| sizes\* | `int[]` | Задает список размеров, например `[20, 50, 100]` |

## Возвращаемое значение

Метод возвращает тот же объект `PageNavigation`.

## Особенности

Метод не меняет текущий размер страницы. Задайте размер по умолчанию методом [setPageSize](set-page-size.md).

## Примеры

**Пример.** Код разрешает размеры 20 и 50 и проверяет размер 30 из адреса:

```php
<?php
use Bitrix\Main\Context;
use Bitrix\Main\UI\PageNavigation;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

// На реальной странице параметр приходит из адреса
Context::getCurrent()->getRequest()->modifyByQueryString('nav-units=page-2-size-30');

$nav = new PageNavigation('nav-units');
$nav->setPageSizes([20, 50]);
$nav->initFromUri();

echo $nav->getCurrentPage() . ' ' . $nav->getPageSize();
```

Код выведет `2 20`. Размера 30 нет в списке, поэтому размер остался прежним.

## Смотрите также

- [PageNavigation::getPageSizes](get-page-sizes.md)
- [PageNavigation::initFromUri](init-from-uri.md)
