---
title: Удалить параметры навигации из адреса PageNavigation::clearParams
description: Метод PageNavigation::clearParams удаляет из объекта Uri параметр запроса или сегменты пути навигации.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::clearParams` удаляет параметры навигации из адреса. Метод нужен, чтобы построить ссылку на первую страницу или на список без навигации, например после смены фильтра.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function clearParams(Web\Uri $uri, $sef)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uri\* | [`Bitrix\Main\Web\Uri`](../../web/uri/index.md) | Задает адрес. Метод меняет этот объект |
| sef\* | `bool` | Значение `true` удаляет сегменты пути ЧПУ, `false` — параметр запроса |

Сигнатура PHP объявляет только тип `uri`.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

В режиме параметра запроса метод вызывает [Uri::deleteParams](../../web/uri/delete-params.md) без `preserveDots`. Поэтому точки и пробелы в именах других параметров адреса станут `_`, например `filter.name` станет `filter_name`.

## Примеры

**Пример.** Код удаляет навигацию из адреса в обоих режимах:

```php
<?php
use Bitrix\Main\UI\PageNavigation;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');

echo $nav->clearParams(new Uri('/units/list.php?nav-units=page-2&sort=name'), false)->getUri() . "\n";
echo $nav->clearParams(new Uri('/units/list/nav-units/page-2/size-20/?sort=name'), true)->getUri();
```

Код выведет:

```text
/units/list.php?sort=name
/units/list/?sort=name
```

## Смотрите также

- [PageNavigation::addParams](add-params.md)
