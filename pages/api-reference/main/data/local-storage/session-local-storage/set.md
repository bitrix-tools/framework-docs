---
title: Записать значение по ключу SessionLocalStorage::set
description: Метод SessionLocalStorage::set записывает значение по ключу и возвращает тот же объект.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::set` записывает значение по ключу и возвращает тот же объект. Запись `$storage['key'] = $value` выполняет то же действие.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function set($key, $value): self
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| key\* | `string` или `int` | Задает ключ |
| value\* | `mixed` | Задает значение. Менеджер хранилищ сохраняет его в кеше или сессии |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод возвращает текущий объект. Менеджер хранилищ сохранит значение после эпилога.

## Примеры

**Пример.** Код записывает два значения цепочкой и выводит данные хранилища:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage
    ->set('code', 'kg')
    ->set('sort', 10)
;

echo $storage['code'] . ' ' . $storage['sort'];
```

Код выведет `kg 10`.

## Смотрите также

- [SessionLocalStorage::get](get.md)
- [SessionLocalStorage::setData](set-data.md)
