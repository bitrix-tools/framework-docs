---
title: Получить имя текущего набора Asset::getTargetName
description: Метод Asset::getTargetName возвращает имя набора, в который попадут следующие файлы и строки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::getTargetName` возвращает имя текущего набора. В этот набор попадут файлы и строки, которые код добавит следующими. Пролог переключает набор сам. В `header.php` текущий набор — `TEMPLATE`, в рабочей области — `PAGE`.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function getTargetName()
```

## Возвращаемое значение

Метод возвращает имя набора в верхнем регистре, например `TEMPLATE`, `PAGE` или имя из [startTarget](start-target.md).

## Примеры

**Пример.** Код начинает свой набор и читает имя:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->startTarget('units');

echo $asset->getTargetName();
```

Код выведет `UNITS`.

## Смотрите также

- [Asset::getTarget](get-target.md)
- [Asset::startTarget](start-target.md)
