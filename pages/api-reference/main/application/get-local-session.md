---
title: Получить локальное хранилище сессии Application::getLocalSession
description: Метод Application::getLocalSession возвращает именованное локальное хранилище сессии пользователя.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getLocalSession` возвращает [локальное хранилище сессии](../data/local-storage/session-local-storage/index.md) по имени. Хранилище хранит данные одного пользователя, например состояние мастера или фильтра. В отличие от [getSession](get-session.md), данные хранилища могут находиться в кеше и не увеличивают сессию PHP.

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
final public function getLocalSession($name): Data\LocalStorage\SessionLocalStorage
```

## Параметры

{% include [Сноска об обязательных параметрах](../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя хранилища, например `vendor_units` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает объект [SessionLocalStorage](../data/local-storage/session-local-storage/index.md). Повторный вызов с тем же именем возвращает тот же объект.

## Особенности

Метод — короткая запись для `getSessionLocalStorageManager()->get($name)`.

## Примеры

**Пример.** Код сохраняет значение в хранилище и читает его:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('vendor_units');
$storage->set('last', 'kg');

echo Application::getInstance()->getLocalSession('vendor_units')->get('last');
$storage->clear();
```

Код выведет `kg`.

## Смотрите также

- [SessionLocalStorage](../data/local-storage/session-local-storage/index.md)
- [Application::getSessionLocalStorageManager](get-session-local-storage-manager.md)
