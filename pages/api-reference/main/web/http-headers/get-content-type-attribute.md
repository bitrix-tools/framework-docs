---
title: Получить атрибут Content-Type HttpHeaders::getContentTypeAttribute
description: Метод HttpHeaders::getContentTypeAttribute возвращает значение атрибута заголовка Content-Type, например charset или boundary.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::getContentTypeAttribute` возвращает значение атрибута из заголовка `Content-Type`. Для атрибутов `charset` и `boundary` есть короткие методы [getCharset](get-charset.md) и [getBoundary](get-boundary.md).

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function getContentTypeAttribute(string $attribute)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| attribute\* | `string` | Задает имя атрибута. Регистр не важен |

## Возвращаемое значение

Метод возвращает значение атрибута без пробелов по краям. Если заголовка `Content-Type` или атрибута нет, метод возвращает `null`.

## Особенности

- Метод не убирает кавычки вокруг значения.
- Метод возвращает значение до следующего знака `=` или `;`, даже внутри кавычек. Например, для `boundary=abc==` метод вернет `abc`.
- Для атрибута без знака `=` метод возвращает пустую строку и выдает предупреждение PHP.

## Примеры

**Пример.** Код читает атрибут `type` составного содержимого:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'multipart/related; type=application/xml; boundary=units']);

echo $headers->getContentTypeAttribute('TYPE');
```

Код выведет `application/xml`.

## Смотрите также

- [HttpHeaders::getCharset](get-charset.md)
- [HttpHeaders::getBoundary](get-boundary.md)
