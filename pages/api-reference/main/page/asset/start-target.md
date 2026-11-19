---
title: Начать набор Asset::startTarget
description: Метод Asset::startTarget начинает набор — следующие файлы и строки попадут в него.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::startTarget` начинает набор. Файлы и строки, которые код добавит следующими, попадут в него. Пролог начинает наборы `TEMPLATE` и `PAGE` сам. Композитный сайт начинает свой набор для каждой динамической области, чтобы передавать ее файлы отдельно.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function startTarget($id = '', $mode = AssetMode::ALL)
```

## Параметры

| Параметр | Тип | Описание |
| --- | --- | --- |
| id | `string` | Задает имя набора. Метод переводит имя в верхний регистр. По умолчанию — пустая строка |
| mode | `int` | Задает режим нового набора — константу `AssetMode`. По умолчанию — `AssetMode::ALL` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если начал набор. Метод возвращает `false`, если имя пустое или свой набор с таким именем уже есть. Для `TEMPLATE` и `PAGE` метод всегда возвращает `true`.

## Особенности

- Для наборов `TEMPLATE` и `PAGE` метод не создает новый набор. Если текущий набор — `TEMPLATE` или `PAGE`, метод делает запрошенный набор текущим. Если открыт свой набор, метод ничего не меняет.
- Перед новым набором метод завершает текущий методом [stopTarget](stop-target.md).
- Нельзя второй раз начать свой набор с тем же именем.

## Примеры

**Пример.** Код начинает набор и пробует начать его повторно:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();

var_dump($asset->startTarget('units'), $asset->startTarget('units'));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [Asset::stopTarget](stop-target.md)
- [Asset::getTargetName](get-target-name.md)
