---
title: Сменить идентификатор сессии SessionInterface::regenerateId
description: Метод SessionInterface::regenerateId выдает сессии новый идентификатор и сохраняет ее данные.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::regenerateId` выдает сессии новый идентификатор и сохраняет данные сессии под ним. Метод защищает от фиксации сессии. Вызывайте его после смены прав пользователя, например после входа.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function regenerateId(): bool;
```

## Возвращаемое значение

Класс `Session` возвращает `true` после смены идентификатора и `false`, если сессия не запущена.

Класс `KernelSession` идентификатор не меняет и всегда возвращает `true`.

## Особенности

Класс `Session` не удаляет старую сессию сразу. Метод записывает в нее новый идентификатор и время смены. Если запрос со старым идентификатором придет в течение 100 секунд, [start](start.md) переключит его на новую сессию. Более поздний запрос получит пустую сессию.

## Примеры

**Пример.** Код меняет идентификатор и проверяет, что данные сохранились:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_view', 'list');
$oldId = $session->getId();

$result = $session->regenerateId();

var_export([$result, $oldId !== $session->getId(), $session->get('units_view')]);
```

Код выведет:

```text
array (
  0 => true,
  1 => true,
  2 => 'list',
)
```

## Смотрите также

- [SessionInterface::getId](get-id.md)
- [SessionInterface::setId](set-id.md)
