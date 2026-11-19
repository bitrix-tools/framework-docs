---
title: Получить ключ хранения SessionLocalStorage::getUniqueName
description: Метод SessionLocalStorage::getUniqueName возвращает ключ, под которым менеджер сохраняет данные хранилища, — идентификатор сессии и имя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::getUniqueName` возвращает ключ, под которым менеджер хранилищ читает и сохраняет данные хранилища.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function getUniqueName(): string
```

## Возвращаемое значение

Метод возвращает строку. Для хранилища из `getLocalSession` это идентификатор сессии и имя хранилища через `_`, например `<идентификатор сессии>_units`.

## Примеры

**Пример.** Код проверяет, что ключ хранения состоит из идентификатора сессии и имени:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$application = Application::getInstance();
$storage = $application->getLocalSession('units');
$sessionId = $application->getKernelSession()->getId();

var_dump($storage->getUniqueName() === $sessionId . '_units');
```

Код выведет `bool(true)`.

## Смотрите также

- [SessionLocalStorage::setUniqueName](set-unique-name.md)
- [SessionLocalStorage::getName](get-name.md)
