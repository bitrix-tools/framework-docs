---
title: Перевести набор в режим COMPOSITE Asset::compositeTarget
description: Метод Asset::compositeTarget переводит набор в режим AssetMode::COMPOSITE — набор попадет только в композитную копию страницы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::compositeTarget` переводит набор в режим `AssetMode::COMPOSITE`. Класс выводит такой набор, только когда композитный сайт строит композитную копию страницы для кеша. В стандартном выводе набора нет.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function compositeTarget($id = '')
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| id | `string` | Задает имя набора. Метод переводит имя в верхний регистр. По умолчанию — пустая строка |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`. Если набора с таким именем нет, метод возвращает `false`.

## Примеры

**Пример.** Код переводит набор в режим `COMPOSITE` и проверяет режим:

```php
<?php
use Bitrix\Main\Page\Asset;
use Bitrix\Main\Page\AssetMode;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startTarget('units');
$asset->compositeTarget('units');

var_dump($asset->getTarget()['MODE'] === AssetMode::COMPOSITE, $asset->compositeTarget('missing'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Asset::setMode](set-mode.md)
- [Композитный сайт](../../../../performance/composite-site.md)
