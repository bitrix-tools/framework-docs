---
title: Разрешить объединение JS Asset::enableOptimizeJs
description: Метод Asset::enableOptimizeJs снова разрешает объединение JS-файлов на текущей странице после disableOptimizeJs.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::enableOptimizeJs` разрешает объединение JS-файлов на текущей странице. По умолчанию объединение разрешено, поэтому метод нужен, только чтобы отменить [disableOptimizeJs](disable-optimize-js.md).

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function enableOptimizeJs()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Метод не включает объединение на сайте. Объединение работает, только если оно включено в настройках главного модуля. Итоговое значение возвращает [optimizeJs](optimize-js.md).

## Примеры

**Пример.** Код выключает и снова разрешает объединение JS:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->disableOptimizeJs();
$disabled = $asset->optimizeJs();
$asset->enableOptimizeJs();

echo var_export($disabled, true) . ' ' . var_export($asset->optimizeJs(), true);
```

Код выведет `false true`, если объединение JS включено в настройках главного модуля.

## Смотрите также

- [Asset::disableOptimizeJs](disable-optimize-js.md)
- [Asset::optimizeJs](optimize-js.md)
