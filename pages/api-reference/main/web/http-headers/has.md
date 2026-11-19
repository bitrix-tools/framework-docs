---
title: Проверить, есть ли заголовок HttpHeaders::has
description: Метод HttpHeaders::has проверяет, есть ли в коллекции заголовок с указанным именем.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `HttpHeaders::has` проверяет, есть ли заголовок в коллекции. Имя не зависит от регистра.

Сигнатура метода в классе `Bitrix\Main\Web\HttpHeaders`:

```php
public function has(string $name): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает имя заголовка |

## Возвращаемое значение

Метод возвращает `true`, если заголовок есть, иначе `false`. Для заголовка с пустым значением метод возвращает `true`.

## Примеры

**Пример.** Код проверяет заголовки в разном регистре:

```php
<?php
use Bitrix\Main\Web\HttpHeaders;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$headers = new HttpHeaders(['Content-Type' => 'text/html']);

var_export([$headers->has('content-type'), $headers->has('Content-Length')]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [HttpHeaders::get](get.md)
