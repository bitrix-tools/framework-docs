---
title: Получить имя хранилища SessionLocalStorage::getName
description: Метод SessionLocalStorage::getName возвращает имя хранилища, переданное в Application::getLocalSession.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::getName` возвращает имя хранилища. Код передает это имя в `Application::getInstance()->getLocalSession($name)`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function getName(): string
```

## Возвращаемое значение

Метод возвращает строку. Имя не меняется, когда сессия получает новый идентификатор. Метод [getUniqueName](get-unique-name.md) возвращает ключ хранения с идентификатором сессии.

## Примеры

**Пример.** Код получает хранилище текущей сессии и выводит его имя:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');

echo $storage->getName();
```

Код выведет `units`.

## Смотрите также

- [SessionLocalStorage::getUniqueName](get-unique-name.md)
