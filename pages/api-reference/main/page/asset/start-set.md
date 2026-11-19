---
title: Начать набор Asset::startSet
description: Метод Asset::startSet начинает набор. Метод вызывает startTarget и остался для совместимости.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::startSet` начинает набор. Метод вызывает [startTarget](start-target.md) с теми же аргументами. Метод остался для совместимости с системой обновлений. В новом коде используйте `startTarget`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function startSet($id = '', $mode = AssetMode::ALL)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| id | `string` | Задает имя набора. По умолчанию — пустая строка |
| mode | `int` | Задает режим набора — константу `AssetMode`. По умолчанию — `AssetMode::ALL` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает результат [startTarget](start-target.md).

## Примеры

**Пример.** Код начинает набор и читает его имя:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startSet('units');

echo $asset->getTargetName();
```

Код выведет `UNITS`.

## Смотрите также

- [Asset::startTarget](start-target.md)
