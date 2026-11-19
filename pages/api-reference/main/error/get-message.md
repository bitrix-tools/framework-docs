---
title: Получить текст ошибки Error::getMessage
description: Метод Error::getMessage возвращает текст сообщения ошибки строкой.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 15.5.9

{% endnote %}

Метод `Error::getMessage` возвращает текст сообщения ошибки.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function getMessage()
```

## Возвращаемое значение

Метод возвращает строку `string`. Если ошибку создали с объектом `LocalizableMessageInterface`, метод приводит его к строке. Объект `LocalizableMessage` при этом переводит фразу на язык из своих настроек или на текущий язык.

## Примеры

**Пример.** Код выводит текст ошибки:

```php
<?php
use Bitrix\Main\Error;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$error = new Error('Unit code is required', 'UNIT_CODE_EMPTY');

echo $error->getMessage();
```

## Смотрите также

- [Error::getLocalizableMessage](get-localizable-message.md)
- [Error::getCode](get-code.md)
