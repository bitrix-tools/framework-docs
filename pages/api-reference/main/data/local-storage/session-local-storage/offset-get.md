---
title: Прочитать значение через синтаксис массива SessionLocalStorage::offsetGet
description: Метод SessionLocalStorage::offsetGet возвращает значение по ключу ссылкой при чтении $storage['key']. Через ссылку можно менять вложенные массивы.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::offsetGet` возвращает значение при чтении `$storage['key']`. Метод реализует интерфейс `\ArrayAccess` и вызывает [get](get.md).

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function &offsetGet($offset)
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` или `int` | Задает ключ |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает значение по ссылке или `null`, если ключа нет. Для отсутствующего ключа метод, как и `get`, создает элемент со значением `null`.

Метод возвращает ссылку, поэтому запись во вложенный массив `$storage['list'][] = $value` меняет данные хранилища.

## Примеры

**Пример.** Код добавляет элементы во вложенный массив хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage['selected'] = [];
$storage['selected'][] = 'kg';
$storage['selected'][] = 'g';

echo implode(', ', $storage['selected']);
```

Код выведет `kg, g`.

## Смотрите также

- [SessionLocalStorage::get](get.md)
- [SessionLocalStorage::offsetSet](offset-set.md)
