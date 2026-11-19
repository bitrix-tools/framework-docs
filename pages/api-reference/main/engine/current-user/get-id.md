---
title: Получить идентификатор пользователя CurrentUser::getId
description: Метод CurrentUser::getId возвращает идентификатор текущего пользователя строкой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `CurrentUser::getId` возвращает идентификатор текущего пользователя. Метод вызывает `CUser::GetID`.

Сигнатура метода в классе `Bitrix\Main\Engine\CurrentUser`:

```php
public function getId()
```

## Возвращаемое значение

Метод возвращает идентификатор строкой, например `"1"`. Для неавторизованного посетителя метод возвращает `"0"`. Если объект не связан с `$USER`, метод возвращает `null`.

Чтобы проверить авторизацию, приведите значение к целому числу и сравните с нулем.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код выводит идентификатор авторизованного пользователя:

  ```php
  <?php
  use Bitrix\Main\Engine\CurrentUser;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  $userId = (int)CurrentUser::get()->getId();

  echo $userId > 0 ? 'User ' . $userId : 'Guest';
  ```

  При запуске из консоли код выведет `Guest`.

- Классический API

  **Пример.** Код получает идентификатор из глобального объекта `$USER`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  global $USER;

  $userId = (int)$USER->GetID();

  echo $userId > 0 ? 'User ' . $userId : 'Guest';
  ```

{% endlist %}

## Смотрите также

- [CurrentUser::get](get.md)
- [CurrentUser::getLogin](get-login.md)
