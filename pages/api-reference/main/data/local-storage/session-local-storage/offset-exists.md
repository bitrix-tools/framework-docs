---
title: Проверить ключ через isset SessionLocalStorage::offsetExists
description: Метод SessionLocalStorage::offsetExists проверяет, есть ли в хранилище ключ со значением, отличным от null. PHP вызывает метод для isset и empty.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::offsetExists` проверяет ключ хранилища. Метод реализует интерфейс `\ArrayAccess`, и PHP вызывает его для `isset($storage['key'])` и `empty($storage['key'])`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function offsetExists($offset): bool
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` или `int` | Задает ключ |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает `true`, если ключ есть и значение не `null`. Для ключа со значением `null` метод возвращает `false`, как функция `isset`.

## Примеры

**Пример.** Код проверяет ключ со значением и ключ со значением `null`:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage['code'] = 'kg';
$storage['view'] = null;

var_dump(isset($storage['code']), isset($storage['view']));
```

Код выведет:

```text
bool(true)
bool(false)
```

## Смотрите также

- [SessionLocalStorage::get](get.md)
- [SessionLocalStorage::offsetUnset](offset-unset.md)
