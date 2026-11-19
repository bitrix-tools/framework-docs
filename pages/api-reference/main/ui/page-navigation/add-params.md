---
title: Добавить параметры навигации в адрес PageNavigation::addParams
description: Метод PageNavigation::addParams добавляет номер и размер страницы в объект Uri — параметром запроса или сегментами пути ЧПУ.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `PageNavigation::addParams` добавляет номер и размер страницы в адрес. Метод формирует адрес в формате, который понимает [initFromUri](init-from-uri.md). Компонент `main.pagenavigation` так строит шаблон ссылок на страницы.

Сигнатура метода в классе `Bitrix\Main\UI\PageNavigation`:

```php
public function addParams(Web\Uri $uri, $sef, $page, $size = null)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| uri\* | [`Bitrix\Main\Web\Uri`](../../web/uri/index.md) | Задает адрес. Метод меняет этот объект |
| sef\* | `bool` | Значение `true` добавляет сегменты пути ЧПУ, `false` — параметр запроса |
| page\* | `int` или `string` | Задает номер страницы или `'all'` для показа всех записей |
| size | `int` или `null` | Задает размер страницы. По умолчанию — `null`, тогда размер в адрес не попадает |

Сигнатура PHP объявляет только тип `uri`.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

- В режиме параметра запроса метод заменяет прежнее значение параметра навигации.
- В режиме параметра запроса метод вызывает [Uri::addParams](../../web/uri/add-params.md) без `preserveDots`. Поэтому точки и пробелы в именах других параметров адреса станут `_`, например `filter.name` станет `filter_name`.
- В режиме ЧПУ метод сначала удаляет прежние сегменты навигации методом [clearParams](clear-params.md). Новые сегменты метод вставляет после последней косой черты пути, перед именем файла.

## Примеры

**Пример.** Код строит ссылку на третью страницу в обоих режимах:

```php
<?php
use Bitrix\Main\UI\PageNavigation;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$nav = new PageNavigation('nav-units');

echo $nav->addParams(new Uri('/units/list.php?sort=name'), false, 3, 20)->getUri() . "\n";
echo $nav->addParams(new Uri('/units/list/?sort=name'), true, 3, 20)->getUri();
```

Код выведет:

```text
/units/list.php?sort=name&nav-units=page-3-size-20
/units/list/nav-units/page-3/size-20/?sort=name
```

## Смотрите также

- [PageNavigation::clearParams](clear-params.md)
- [PageNavigation::initFromUri](init-from-uri.md)
