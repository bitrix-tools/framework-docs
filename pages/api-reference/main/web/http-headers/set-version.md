---
title: Задать версию HTTP HttpHeaders::setVersion
description: Метод HttpHeaders::setVersion задает версию протокола HTTP, например 1.1 или 2.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::setVersion` задает версию протокола HTTP.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function setVersion(string $version): HttpHeaders
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| version\* | `string` | Задает версию без префикса `HTTP/`, например `1.0` или `2` |

## Возвращаемое значение

Метод возвращает тот же объект `HttpHeaders`.

## Примеры

**Пример.** Код меняет версию HTTP:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders();

echo $headers->getVersion() . ' ' . $headers->setVersion('2')->getVersion();
```

Код выведет `1.1 2`.

## Смотрите также

- [HttpHeaders::getVersion](get-version.md)
