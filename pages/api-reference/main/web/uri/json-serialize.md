---
title: Получить адрес для JSON Uri::jsonSerialize
description: Метод Uri::jsonSerialize возвращает адрес строкой, поэтому json_encode записывает объект Uri как строку.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::jsonSerialize` возвращает адрес строкой. Класс реализует интерфейс `JsonSerializable`, поэтому `json_encode` и `Bitrix\Main\Web\Json::encode` записывают объект как строку. Прямой вызов метода не нужен.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function jsonSerialize(): string
```

## Возвращаемое значение

Метод возвращает результат [getUri](get-uri.md).

## Примеры

**Пример.** Код кодирует в JSON массив с объектом адреса:

```php
<?php
use Bitrix\Main\Web\Json;
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

echo Json::encode(['next' => new Uri('/units/?page=2')]);
```

Код выведет `{"next":"\/units\/?page=2"}`.

## Смотрите также

- [Uri::getUri](get-uri.md)
- [Json](../json/index.md)
