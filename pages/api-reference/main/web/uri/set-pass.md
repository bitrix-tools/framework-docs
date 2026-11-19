---
title: Задать пароль Uri::setPass
description: Метод Uri::setPass раскодирует и сохраняет пароль для адреса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.7

{% endnote %}

Метод `Uri::setPass` задает пароль для адреса. Метод меняет сам объект. Пароль попадает в адрес, только если задано имя пользователя.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function setPass($pass)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| pass\* | `string` | Задает пароль. Метод раскодирует его функцией `rawurldecode` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Примеры

**Пример.** Код задает пароль со специальным символом:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://api@example.com/feed.xml');
$uri->setPass('p@ss');

echo $uri->getUri();
```

Код выведет `https://api:p%40ss@example.com/feed.xml`.

## Смотрите также

- [Uri::getPass](get-pass.md)
- [Uri::setUser](set-user.md)
