---
title: Запретить объединение JS Asset::disableOptimizeJs
description: Метод Asset::disableOptimizeJs запрещает объединение JS-файлов на текущей странице.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::disableOptimizeJs` запрещает объединение JS-файлов на текущей странице. Каждый файл выведется своим тегом `script`. Метод нужен, например, для отладки скриптов.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function disableOptimizeJs()
```

## Возвращаемое значение

Метод ничего не возвращает.

## Особенности

Вызовите метод до вывода скриптов. После [getJs](get-js.md) вызов не действует.

## Примеры

**Пример.** Код запрещает объединение и проверяет итоговое значение:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$asset = Asset::getInstance();
$asset->disableOptimizeJs();

var_dump($asset->optimizeJs());
```

Код выведет `bool(false)`.

## Смотрите также

- [Asset::enableOptimizeJs](enable-optimize-js.md)
