---
title: Получить фрагмент Uri::getFragment
description: Метод Uri::getFragment возвращает фрагмент адреса — часть после знака решетки.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 14.0.15

{% endnote %}

Метод `Uri::getFragment` возвращает фрагмент адреса — часть после `#`, например якорь на странице.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function getFragment(): string
```

## Возвращаемое значение

Метод возвращает фрагмент без `#` или пустую строку, если фрагмента нет.

## Примеры

**Пример.** Код читает фрагмент адреса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo (new Uri('/units/list.php?page=2#unit-kg'))->getFragment();
```

Код выведет `unit-kg`.

## Смотрите также

- [Uri::withFragment](with-fragment.md)
- [Uri::getLocator](get-locator.md)
