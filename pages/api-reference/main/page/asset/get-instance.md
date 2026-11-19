---
title: Получить объект Asset::getInstance
description: Статический метод Asset::getInstance возвращает единственный объект Asset текущего запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Asset::getInstance` возвращает объект `Asset`. Объект один на весь запрос, поэтому файлы, которые добавили страница, шаблон и компоненты, попадают в один список.

Сигнатура метода в классе `Bitrix\Main\Page\Asset`:

```php
public static function getInstance()
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Page\Asset`.

## Особенности

Конструктор класса закрытый. Новый объект создает только метод [setAjax](set-ajax.md).

## Примеры

**Пример.** Код получает объект дважды и сравнивает:

```php
<?php
use Bitrix\Main\Page\Asset;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Asset::getInstance() === Asset::getInstance());
```

Код выведет `bool(true)`.

## Смотрите также

- [Asset::addCss](add-css.md)
- [Asset::addJs](add-js.md)
