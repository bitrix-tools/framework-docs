---
title: Получить интервал онлайна UserTable::getSecondsForLimitOnline
description: Метод UserTable::getSecondsForLimitOnline возвращает число секунд с последней активности, в течение которых пользователь считается онлайн.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `UserTable::getSecondsForLimitOnline` возвращает число секунд, в течение которых пользователь считается онлайн после последней активности. Вычисляемое поле `IS_ONLINE` использует это значение.

Сигнатура метода в классе `Bitrix\Main\UserTable`:

```php
public static function getSecondsForLimitOnline()
```

## Возвращаемое значение

Метод возвращает целое число секунд. Метод берет значение из настройки PHP `session.gc_maxlifetime`:

- если настройка равна `0` или не задана, метод возвращает `1440`,
- если настройка меньше `120`, метод возвращает `120`,
- в остальных случаях метод возвращает значение настройки.

## Примеры

{% list tabs %}

- D7

  **Пример.** Код выводит интервал и число пользователей онлайн:

  ```php
  <?php
  use Bitrix\Main\UserTable;

  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  echo UserTable::getSecondsForLimitOnline() . PHP_EOL;
  echo UserTable::getCount(['=IS_ONLINE' => 'Y']);
  ```

- Классический API

  Метод `CUser::GetSecondsForLimitOnline` вызывает метод `UserTable::getSecondsForLimitOnline` и возвращает то же значение.

  **Пример.** Код выводит интервал через `CUser`:

  ```php
  <?php
  require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

  echo CUser::GetSecondsForLimitOnline();
  ```

{% endlist %}

## Смотрите также

- [UserTable::getUserGroupIds](get-user-group-ids.md)
