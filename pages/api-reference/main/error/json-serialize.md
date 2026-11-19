---
title: Подготовить ошибку для JSON Error::jsonSerialize
description: Метод Error::jsonSerialize возвращает массив с сообщением, кодом и дополнительными данными ошибки для json_encode.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Error::jsonSerialize` возвращает массив, который `json_encode` и [Json::encode](../web/json/encode.md) используют вместо объекта. Эти функции вызывают метод сами.

Сигнатура метода в классе `Bitrix\Main\Error`:

```php
public function jsonSerialize()
```

## Возвращаемое значение

Метод возвращает массив `array`.

#|
|| Ключ | Описание ||
|| message<br>`string` | Содержит текст сообщения, как в [getMessage](get-message.md) ||
|| code<br>`int`, `string` | Содержит код ошибки ||
|| customData<br>`mixed` | Содержит дополнительные данные или `null` ||
|#

## Примеры

**Пример.** Код кодирует список ошибок в JSON:

```php
<?php
use Bitrix\Main\Error;
use Bitrix\Main\Web\Json;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Json::encode([new Error('Unit code is required', 'UNIT_CODE_EMPTY')]);
```

## Смотрите также

- [Json::encode](../web/json/encode.md)
