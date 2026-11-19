---
title: Проверить, есть ли ключ SessionInterface::has
description: Метод SessionInterface::has проверяет, есть ли в сессии ключ, в том числе со значением null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionInterface::has` проверяет, есть ли в сессии ключ.

Сигнатура метода в интерфейсе `Bitrix\Main\Session\SessionInterface`:

```php
public function has($name);
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| name\* | `string` | Задает ключ |

Тип в таблице описывает назначение аргумента. Сигнатура PHP не объявляет его.

## Возвращаемое значение

Метод возвращает `true`, если ключ есть, иначе `false`.

В отличие от `isset($session['key'])`, метод возвращает `true` и для ключа, который [set](set.md) записал со значением `null`. Для ключа, который создал только [get](get.md) при чтении, метод возвращает `false`.

## Примеры

**Пример.** Код сравнивает `has` и `isset` для значения `null`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$session = Application::getInstance()->getSession();
$session->set('units_filter', null);

var_export([$session->has('units_filter'), isset($session['units_filter'])]);
```

Код выведет:

```text
array (
  0 => true,
  1 => false,
)
```

## Смотрите также

- [SessionInterface::get](get.md)
