---
title: Получить лицензию Application::getLicense
description: Метод Application::getLicense возвращает объект лицензии продукта — срок действия, демо-режим, регион и число пользователей.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getLicense` возвращает объект лицензии продукта. Через объект код проверяет демо-режим, срок действия лицензии, регион и число пользователей.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public function getLicense(): License
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\License`. Объект один на запрос. В таблице — основные методы объекта.

| Метод | Результат |
| --- | --- |
| `isDemo()` | `true`, если продукт работает в демо-режиме |
| `getExpireDate()` | Дата окончания демо-периода или редакции с ограниченным сроком, иначе `null` |
| `getSupportExpireDate()` | Дата окончания обновлений или `null` |
| `getRegion()` | Регион лицензии, например `ru`, или `null` |
| `getMaxUsers()` | Число пользователей по лицензии |

## Особенности

Метод `getKey` возвращает ключ лицензии. Не выводите ключ на страницы и в журналы.

## Примеры

**Пример.** Код проверяет демо-режим:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Application::getInstance()->getLicense()->isDemo() ? 'demo' : 'full';
```

Код выведет `demo` для демо-версии и `full` для продукта с лицензией.

## Смотрите также

- [Application::getInstance](get-instance.md)
