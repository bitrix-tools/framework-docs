---
title: Получить копию с другой схемой Uri::withScheme
description: Метод Uri::withScheme возвращает копию адреса с другой схемой и не меняет исходный объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `Uri::withScheme` возвращает копию адреса с другой схемой. Метод не меняет исходный объект. Метод входит в интерфейс PSR-7 `UriInterface`.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function withScheme(string $scheme): UriInterface
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| scheme\* | `string` | Задает схему без `:`, например `https` |

## Возвращаемое значение

Метод возвращает новый объект `Uri`.

## Особенности

Метод не проверяет схему и не приводит ее к нижнему регистру, в отличие от конструктора. Передавайте схему в нижнем регистре. От нее зависят порт по умолчанию в [getPort](get-port.md) и вывод порта в [getUri](get-uri.md).

## Примеры

**Пример.** Код получает HTTPS-вариант адреса:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('http://example.com/units/');
$secure = $uri->withScheme('https');

echo $uri->getUri() . ' ' . $secure->getUri();
```

Код выведет `http://example.com/units/ https://example.com/units/`.

## Смотрите также

- [Uri::getScheme](get-scheme.md)
