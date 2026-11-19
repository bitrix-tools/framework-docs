---
title: Проверить, администратор ли пользователь CurrentUser::isAdmin
description: Метод CurrentUser::isAdmin проверяет, входит ли текущий пользователь в группу администраторов.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::isAdmin` проверяет, администратор ли текущий пользователь. Метод вызывает `CUser::IsAdmin`.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function isAdmin(): bool
```

## Возвращаемое значение

Метод возвращает `true`, если пользователь входил в группу с идентификатором `1` — «Администраторы» — на момент авторизации или последнего обновления данных сессии. Иначе метод возвращает `false`, в том числе если объект не связан с `$USER`.

Если сайт подключен к контроллеру сайтов и контроллер ограничивает права администраторов, метод `CUser::IsAdmin` проверяет признак администратора контроллера.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код выводит `Debug panel` для администратора и `Access denied` для остальных:

  ```php
  <?php
  use Bitrix\Main\Engine\CurrentUser;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  echo CurrentUser::get()->isAdmin() ? 'Debug panel' : 'Access denied';
  ```

  При запуске из консоли код выведет `Access denied`.

- Классический API

  **Пример.** Код выполняет ту же проверку через глобальный объект `$USER`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $USER;

  echo $USER->IsAdmin() ? 'Debug panel' : 'Access denied';
  ```

{% endlist %}

## Смотрите также

- [CurrentUser::canDoOperation](can-do-operation.md)
