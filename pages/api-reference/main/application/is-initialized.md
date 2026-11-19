---
title: Проверить, подготовлено ли ядро Application::isInitialized
description: Метод Application::isInitialized проверяет, подготовил ли пролог ядро к обработке запроса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::isInitialized` проверяет, подготовлено ли ядро к обработке запроса. Метод нужен коду, который может выполняться до пролога, например в начале `dbconn.php` или в обработчике ошибок.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function isInitialized()
```

## Возвращаемое значение

Метод возвращает `true`, если метод [initialize](initialize.md) уже выполнился, иначе `false`.

## Примеры

**Пример.** Код проверяет ядро после пролога:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::getInstance()->isInitialized());
```

Код выведет `bool(true)`.

## Смотрите также

- [Application::initialize](initialize.md)
