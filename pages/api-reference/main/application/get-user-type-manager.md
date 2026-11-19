---
title: Получить менеджер пользовательских полей Application::getUserTypeManager
description: Статический метод Application::getUserTypeManager возвращает менеджер пользовательских полей — глобальный объект $USER_FIELD_MANAGER.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Статический метод `Application::getUserTypeManager` возвращает менеджер пользовательских полей. Через менеджер код получает описания полей `UF_*` объекта и их значения. Метод заменяет обращение к глобальной переменной `$USER_FIELD_MANAGER`.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
public static function getUserTypeManager()
```

## Возвращаемое значение

Метод возвращает объект `CUserTypeManager` из глобальной переменной `$USER_FIELD_MANAGER`. До подключения пролога метод возвращает `null`.

## Примеры

**Пример.** Код получает пользовательские поля объекта `USER`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$fields = Application::getUserTypeManager()->GetUserFields('USER');

echo implode(',', array_keys($fields));
```

Код выведет коды полей через запятую, например `UF_DEPARTMENT,UF_PHONE_INNER`. Если у пользователей нет своих полей, код выведет пустую строку.

## Смотрите также

- [Пользовательские поля](../../../cms-basics/userfields.md)
