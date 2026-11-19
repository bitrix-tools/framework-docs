---
title: Получить переводимое сообщение Error::getLocalizableMessage
description: Метод Error::getLocalizableMessage возвращает объект переводимого сообщения ошибки или null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Error::getLocalizableMessage` возвращает объект переводимого сообщения, если ошибку создали с ним. С объектом код приложения может получить текст на нужном языке, а не на текущем.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function getLocalizableMessage(): ?LocalizableMessageInterface
```

## Возвращаемое значение

Метод возвращает объект `Bitrix\Main\Localization\LocalizableMessageInterface` или `null`, если сообщение — обычная строка.

## Примеры

**Пример.** Код проверяет, переводимое ли сообщение у ошибки:

```php
<?php
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$error = new Error('Unit code is required');

var_dump($error->getLocalizableMessage());
```

Код выведет `NULL`, потому что код передал сообщение строкой.

## Смотрите также

- [Error::getMessage](get-message.md)
