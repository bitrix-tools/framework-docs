---
title: Записать значение через синтаксис массива SessionLocalStorage::offsetSet
description: Метод SessionLocalStorage::offsetSet записывает значение при присваивании $storage['key'] = $value или добавляет его в конец при присваивании $storage[] = $value.
---

{% note info "" %}

**Модуль:** `main` — подключать отдельно не нужно

{% endnote %}

Метод `SessionLocalStorage::offsetSet` записывает значение при присваивании `$storage['key'] = $value`. Метод реализует интерфейс `\ArrayAccess`.

Сигнатура метода в классе `Bitrix\Main\Data\LocalStorage\SessionLocalStorage`:

```php
public function offsetSet($offset, $value): void
```

## Параметры

{% include [Сноска об обязательных параметрах](../../../../_includes/required.md) %}

| Параметр | Тип | Описание |
| --- | --- | --- |
| offset\* | `string`, `int` или `null` | Задает ключ. Для записи `$storage[] = $value` PHP передает `null`, и метод добавляет значение в конец с числовым ключом |
| value\* | `mixed` | Задает значение |

Типы в таблице описывают назначение аргументов. Сигнатура PHP не объявляет их.

## Возвращаемое значение

Метод ничего не возвращает.

## Примеры

**Пример.** Код записывает значение по ключу и добавляет значение в конец:

```php
<?php
use Bitrix\Main\Application;

require $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$storage = Application::getInstance()->getLocalSession('units');
$storage->clear();
$storage['code'] = 'kg';
$storage[] = 'g';

echo json_encode($storage->getData());
```

Код выведет `{"code":"kg","0":"g"}`.

## Смотрите также

- [SessionLocalStorage::set](set.md)
- [SessionLocalStorage::offsetGet](offset-get.md)
