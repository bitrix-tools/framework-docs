---
title: Создать объект для AJAX Asset::setAjax
description: Метод Asset::setAjax создает новый пустой объект Asset в режиме AJAX и делает его текущим.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Asset::setAjax` создает новый пустой объект `Asset` в режиме AJAX и делает его текущим. Метод `$APPLICATION->ShowAjaxHead()` вызывает его сам, когда страница отдает HTML для вставки через AJAX. В этом режиме [getCss](get-css.md) возвращает скрипт `BX.loadCSS` вместо тегов `link`, а объединение файлов не работает.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public function setAjax()
```

## Возвращаемое значение

Метод возвращает новый объект `Asset`. После вызова метод [getInstance](get-instance.md) возвращает этот же объект.

## Особенности

Новый объект не содержит файлы и строки, которые добавили в прежний.

## Примеры

**Пример.** Код переключает объект в режим AJAX:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$previous = Asset::getInstance();
$asset = $previous->setAjax();

echo var_export($asset === $previous, true) . ' '
    . var_export($asset === Asset::getInstance(), true) . ' '
    . var_export($asset->optimizeCss(), true);
```

Код выведет `false true false`.

## Смотрите также

- [Asset::getInstance](get-instance.md)
- [Asset::getCss](get-css.md)
