---
title: Получить значение по ключу SessionLocalStorage::get
description: Метод SessionLocalStorage::get возвращает значение по ключу ссылкой. Для отсутствующего ключа метод создает элемент со значением null.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::get` возвращает значение хранилища по ключу. При чтении `$storage['key']` метод [offsetGet](offset-get.md) вызывает этот же метод.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function &get($key)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` или `int` | Задает ключ |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает значение по ссылке. Если ключа нет, метод возвращает `null`.

## Особенности

- Метод возвращает ссылку на элемент. Поэтому для отсутствующего ключа метод создает элемент со значением `null`, и ключ попадает в [getData](get-data.md) и [count](count.md). Проверяйте ключ через `isset` до чтения.
- Через ссылку можно изменить вложенный массив без повторной записи, например `$list = &$storage->get('list'); $list[] = 1;`.

## Примеры

**Пример.** Код читает сохраненное значение и проверяет ключ, которого нет:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->set('code', 'kg');

echo $storage->get('code') . ' ';
echo isset($storage['view']) ? $storage->get('view') : 'нет ключа view';
```

Код выведет `kg нет ключа view`.

## Смотрите также

- [SessionLocalStorage::set](set.md)
- [SessionLocalStorage::offsetGet](offset-get.md)
