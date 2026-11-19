---
title: Проверить, создан ли объект приложения Application::hasInstance
description: Статический метод Application::hasInstance проверяет, создан ли объект приложения, и не создает его.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::hasInstance` проверяет, создан ли объект приложения. В отличие от [getInstance](get-instance.md), метод не создает объект. Метод нужен коду, который может работать до пролога, например обработчику ошибок или автозагрузчику.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function hasInstance()
```

## Возвращаемое значение

Метод возвращает `true`, если объект приложения создан, иначе `false`.

## Примеры

**Пример.** Код проверяет объект приложения после пролога:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

var_dump(Application::hasInstance());
```

Код выведет `bool(true)`.

## Смотрите также

- [Application::getInstance](get-instance.md)
