---
title: Удалить значение через unset SessionLocalStorage::offsetUnset
description: Метод SessionLocalStorage::offsetUnset удаляет элемент хранилища при вызове unset($storage['key']).
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::offsetUnset` удаляет элемент хранилища при вызове `unset($storage['key'])`. Метод реализует интерфейс `\ArrayAccess`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function offsetUnset($offset): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string` или `int` | Задает ключ. Если ключа нет, метод ничего не делает |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код удаляет один ключ из хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->setData(['code' => 'kg', 'sort' => 10]);
unset($storage['sort']);

echo json_encode($storage->getData());
```

Код выведет `{"code":"kg"}`.

## Смотрите также

- [SessionLocalStorage::clear](clear.md)
- [SessionLocalStorage::offsetExists](offset-exists.md)
