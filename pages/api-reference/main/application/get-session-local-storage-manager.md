---
title: Получить менеджер локальных хранилищ сессии Application::getSessionLocalStorageManager
description: Метод Application::getSessionLocalStorageManager возвращает менеджер локальных хранилищ сессии — именованных хранилищ в кеше или в сессии PHP.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Application::getSessionLocalStorageManager` возвращает менеджер [локальных хранилищ сессии](../data/local-storage/session-local-storage/index.md). Хранилище хранит данные одного пользователя под своим именем. Если кеш работает через Redis, Memcache, Memcached или APCu, хранилища находятся в кеше, иначе — в сессии PHP.

Для одного хранилища используйте короткий вызов [getLocalSession](get-local-session.md).

Сигнатура метода в классе `Bitrix\Main\Application`:

```php
final public function getSessionLocalStorageManager(): Data\LocalStorage\SessionLocalStorageManager
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Data\LocalStorage\SessionLocalStorageManager`. Объект один на запрос.

## Особенности

- Ключ `ttl` секции `session_local_storage` файла `.settings.php` задает время жизни хранилищ в кеше в секундах.
- Метод `clearAll` менеджера очищает все хранилища пользователя.

## Примеры

**Пример.** Код записывает значение в хранилище и проверяет, что менеджер загрузил его:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$manager = Application::getInstance()->getSessionLocalStorageManager();
$manager->get('vendor_units')->set('last', 'kg');

echo var_export($manager->exists('vendor_units'), true) . ' ' . $manager->get('vendor_units')->get('last');
$manager->clear('vendor_units');
```

Код выведет `true kg`.

## Смотрите также

- [Application::getLocalSession](get-local-session.md)
- [SessionLocalStorage](../data/local-storage/session-local-storage/index.md)
