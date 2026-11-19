---
title: Задать имя пользователя Uri::setUser
description: Метод Uri::setUser раскодирует и сохраняет имя пользователя для адреса.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

**Доступно с версии:** 16.5.7

{% endnote %}

Метод `Uri::setUser` задает имя пользователя для адреса. Метод меняет сам объект.

Сигнатура метода в классе `Bitrix\Main\Web\Uri`:

```php
public function setUser($user)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| user\* | `string` | Задает имя пользователя. Метод раскодирует его функцией `rawurldecode` |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает тот же объект `Uri`.

## Особенности

Метод раскодирует значение. Передавайте `%` в имени как `%25`.

## Примеры

**Пример.** Код добавляет учетные данные в адрес:

```php
<?php
use Bitrix\Main\Web\Uri;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$uri = new Uri('https://example.com/feed.xml');
$uri->setUser('api user')->setPass('secret');

echo $uri->getUri();
```

Код выведет `https://api%20user:secret@example.com/feed.xml`.

## Смотрите также

- [Uri::getUser](get-user.md)
- [Uri::setPass](set-pass.md)
